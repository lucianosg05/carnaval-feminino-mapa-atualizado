// Serviço de API: gerencia todas as requisições HTTP para o backend

// Função para determinar a URL base da API de acordo com o ambiente
function getApiBase(): string {
  // Em desenvolvimento local: usa servidor local
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:4000/api'
  }
  
  // Em produção: usa backend Railway com HTTPS
  const railwayUrl = 'https://carnaval-feminino-mapa-atualizado-production-de97.up.railway.app/api'
  
  // Tenta usar variável de ambiente customizada se disponível
  const envBase = import.meta.env.VITE_API_BASE
  if (envBase && envBase.startsWith('http')) {
    console.log('[API] Using VITE_API_BASE:', envBase)
    return envBase
  }
  
  // Fallback: usa Railway como padrão
  console.log('[API] Using Railway backend:', railwayUrl)
  return railwayUrl
}

const API_BASE = getApiBase()

// Funções para gerenciar token JWT armazenado no localStorage
export function setToken(token: string | null) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function getToken() {
  return localStorage.getItem('token')
}

// Função genérica para fazer requisições HTTP com autenticação automática
async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  // Prepara headers com Content-Type padrão e token de autenticação se existir
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const fullUrl = `${API_BASE}${path}`
  console.log('[API] Full request URL:', fullUrl)
  // Faz fetch com credenciais para suportar cookies
  const res = await fetch(fullUrl, { headers, credentials: 'include', ...options })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || res.statusText)
  }
  return res.json().catch(() => null)
}

// API de autenticação: registro, login e logout
export const auth = {
  register: (data: { email: string; password: string }) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' })
}

// API de blocos carnavalescos: CRUD completo
export const blocksApi = {
  // Lista todos os blocos públicos
  list: async () => {
    try {
      console.log('[API] Fetching blocks from:', API_BASE)
      const data = await request('/blocks')
      console.log('[API] Blocos recebidos:', data?.length || 0)
      if (Array.isArray(data)) return data.map(normalizeBlock)
      return data
    } catch (error) {
      console.error('[API] Erro ao buscar blocos:', error)
      throw error
    }
  },
  // Lista apenas blocos que o usuário autenticado pode gerenciar (admin)
  adminList: async () => {
    const token = getToken()
    const res = await fetch(`${API_BASE}/blocks/admin/list`, { headers: { Authorization: `Bearer ${token || ''}` } })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || res.statusText)
    }
    const data = await res.json().catch(() => null)
    if (Array.isArray(data)) return data.map(normalizeBlock)
    return data
  },
  // Obtém detalhes de um bloco específico por ID
  get: async (id: string) => {
    const data = await request(`/blocks/${id}`)
    return normalizeBlock(data)
  },
  // Cria novo bloco com upload de imagem
  create: (formData: FormData) => fetch(`${API_BASE}/blocks`, { 
    method: 'POST', 
    body: formData, 
    headers: { Authorization: `Bearer ${getToken() || ''}` } 
  }).then(async r => {
    const contentType = r.headers.get('content-type')
    let data
    try {
      data = await r.json()
    } catch (e) {
      data = { error: `Server error: ${r.status} ${r.statusText}` }
    }
    if (!r.ok) throw new Error(data.error || 'Erro ao criar bloco')
    return normalizeBlock(data)
  }),
  // Atualiza bloco existente
  update: (id: string, formData: FormData) => fetch(`${API_BASE}/blocks/${id}`, { 
    method: 'PUT', 
    body: formData, 
    headers: { Authorization: `Bearer ${getToken() || ''}` } 
  }).then(async r => {
    const contentType = r.headers.get('content-type')
    let data
    try {
      data = await r.json()
    } catch (e) {
      data = { error: `Server error: ${r.status} ${r.statusText}` }
    }
    if (!r.ok) throw new Error(data.error || 'Erro ao atualizar bloco')
    return normalizeBlock(data)
  }),
  // Deleta um bloco
  delete: (id: string) => request(`/blocks/${id}`, { method: 'DELETE' })
}

// Normaliza dados do bloco: converte strings JSON em arrays, trata nulls
function normalizeBlock(block: any) {
  if (!block) return block
  const b = { ...block }
  // Converte strings JSON em arrays para imagens e vídeos
  try {
    b.imagens = typeof b.imagens === 'string' ? JSON.parse(b.imagens) : (b.imagens || [])
  } catch (e) {
    b.imagens = []
  }
  try {
    b.videos = typeof b.videos === 'string' ? JSON.parse(b.videos) : (b.videos || [])
  } catch (e) {
    b.videos = []
  }
  // Converte valores null em strings vazias para melhor compatibilidade com formulários
  const textFields = ['descricao','contato','cidade','estado','endereco','formacao','vertenteFeminista','redesSociais']
  textFields.forEach(f => { if (b[f] === null) b[f] = '' })
  return b
}

// API de eventos associados aos blocos: CRUD completo
export const eventsApi = {
  // Lista todos os eventos públicos
  list: () => request('/events'),
  // Lista apenas eventos que o usuário autenticado pode gerenciar (admin)
  adminList: async () => {
    const token = getToken()
    const res = await fetch(`${API_BASE}/events/admin/list`, { headers: { Authorization: `Bearer ${token || ''}` } })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || res.statusText)
    }
    return res.json()
  },
  // Obtém detalhes de um evento específico por ID
  get: (id: string) => request(`/events/${id}`),
  // Obtém evento específico apenas se o usuário pode gerenciá-lo (admin)
  adminGet: async (id: string) => {
    const token = getToken()
    const res = await fetch(`${API_BASE}/events/admin/${id}`, { headers: { Authorization: `Bearer ${token || ''}` } })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || res.statusText)
    }
    return res.json()
  },
  // Cria novo evento
  create: (formData: FormData) => fetch(`${API_BASE}/events`, { method: 'POST', body: formData, headers: { Authorization: `Bearer ${getToken() || ''}` } }).then(r => r.json()),
  // Atualiza evento existente
  update: (id: string, formData: FormData) => fetch(`${API_BASE}/events/${id}`, { method: 'PUT', body: formData, headers: { Authorization: `Bearer ${getToken() || ''}` } }).then(r => r.json()),
  // Deleta um evento
  delete: (id: string) => request(`/events/${id}`, { method: 'DELETE' })
}
