const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export function setToken(token: string | null) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function getToken() {
  return localStorage.getItem('token')
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { headers, credentials: 'include', ...options })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || res.statusText)
  }
  return res.json().catch(() => null)
}

export const auth = {
  register: (data: { email: string; password: string }) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' })
}

export const blocksApi = {
  list: async () => {
    const data = await request('/blocks')
    if (Array.isArray(data)) return data.map(normalizeBlock)
    return data
  },
  // Authenticated admin list: returns only blocks the current user can manage
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
  get: async (id: string) => {
    const data = await request(`/blocks/${id}`)
    return normalizeBlock(data)
  },
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
  delete: (id: string) => request(`/blocks/${id}`, { method: 'DELETE' })
}
function normalizeBlock(block: any) {
  if (!block) return block
  const b = { ...block }
  // Parse imagens/videos if stored as JSON strings
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
  // Ensure textual nulls become empty strings for frontend forms
  const textFields = ['descricao','contato','cidade','estado','endereco','formacao','vertenteFeminista','redesSociais']
  textFields.forEach(f => { if (b[f] === null) b[f] = '' })
  return b
}
export const eventsApi = {
  list: () => request('/events'),
  // Admin-only list: events the current user can manage
  adminList: async () => {
    const token = getToken()
    const res = await fetch(`${API_BASE}/events/admin/list`, { headers: { Authorization: `Bearer ${token || ''}` } })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || res.statusText)
    }
    return res.json()
  },
  get: (id: string) => request(`/events/${id}`),
  // Admin get: fetch a single event only if the current user can manage it
  adminGet: async (id: string) => {
    const token = getToken()
    const res = await fetch(`${API_BASE}/events/admin/${id}`, { headers: { Authorization: `Bearer ${token || ''}` } })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || res.statusText)
    }
    return res.json()
  },
  create: (formData: FormData) => fetch(`${API_BASE}/events`, { method: 'POST', body: formData, headers: { Authorization: `Bearer ${getToken() || ''}` } }).then(r => r.json()),
  update: (id: string, formData: FormData) => fetch(`${API_BASE}/events/${id}`, { method: 'PUT', body: formData, headers: { Authorization: `Bearer ${getToken() || ''}` } }).then(r => r.json()),
  delete: (id: string) => request(`/events/${id}`, { method: 'DELETE' })
}
