import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import prisma from './prismaClient.js'

dotenv.config()

const app = express()
// Allow dev frontend origins (Vite) and enable credentials. In production, restrict this.
app.use(cors({ origin: [ 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://26.236.240.201:8080', 'http://26.236.240.201:8081', 'http://26.236.240.201:8082', 'http://26.236.240.201:8083', 'http://192.168.15.67:8080', 'http://192.168.15.67:8081' ], credentials: true }))
app.options('*', cors())
app.use(express.json())
app.use(cookieParser())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'server', 'uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage
})

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Unauthorized - No auth header' })
  
  const token = auth.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized - No token' })
  
  try {
    // Tenta verificar como token local
    jwt.verify(token, JWT_SECRET)
    const data = jwt.decode(token)
    req.user = data
    next()
  } catch (e) {
    // Se falhar, aceita como token Firebase válido (será verificado no frontend)
    // Decodifica o token Firebase sem verificar assinatura (apenas para pegar o usuário)
    try {
      const data = jwt.decode(token)
      if (data && (data.uid || data.user_id || data.sub)) {
        req.user = { 
          id: data.uid || data.user_id || data.sub, 
          email: data.email 
        }
        return next()
      } else {
        return res.status(401).json({ error: 'Invalid token format' })
      }
    } catch (e2) {
      return res.status(401).json({ error: 'Invalid token - decode error' })
      return res.status(401).json({ error: 'Invalid token - decode error' })
    }
  }
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Email already registered' })
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, password: hash } })
    const token = generateToken(user)
    res.json({ token, user: { id: user.id, email: user.email } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
    const token = generateToken(user)
    res.json({ token, user: { id: user.id, email: user.email } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  // client should remove token
  res.json({ ok: true })
})

// Blocks CRUD
app.get('/api/blocks', async (req, res) => {
  const blocks = await prisma.block.findMany({ include: { eventos: true } })
  res.json(blocks)
})

// Admin endpoint: Get only blocks user can manage
app.get('/api/blocks/admin/list', authMiddleware, async (req, res) => {
  try {
    // Each user can only see and manage their own blocks
    const blocks = await prisma.block.findMany({
      where: { ownerId: req.user.id }
    })
    res.json(blocks)
  } catch (e) {
    console.error('Error fetching admin blocks:', e)
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/blocks/:id', async (req, res) => {
  const { id } = req.params
  const block = await prisma.block.findUnique({ where: { id }, include: { eventos: true } })
  if (!block) return res.status(404).json({ error: 'Not found' })
  res.json(block)
})

app.post('/api/blocks', authMiddleware, upload.any(), async (req, res) => {
  try {
    const data = req.body
    
    
    if (!data.nome || data.nome.trim() === '') {
      return res.status(400).json({ error: 'Nome é obrigatório' })
    }
    
    // Organize files by field name
    const filesByField = {}
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = []
        }
        filesByField[file.fieldname].push(file)
      })
    }
    
    

    // Build base URL for served uploads
    const baseUrl = `${req.protocol}://${req.get('host')}`

    // Handle main photo
    if (filesByField.foto && filesByField.foto[0]) {
      data.foto = `${baseUrl}/uploads/${filesByField.foto[0].filename}`
    }

    // handle local coordinates
    const localLat = data.localLat ? parseFloat(data.localLat) : null
    const localLng = data.localLng ? parseFloat(data.localLng) : null

    // Handle redesSociais - try to parse as JSON, fallback to string
    let redes = data.redesSociais
    if (redes) {
      try {
        redes = JSON.parse(redes)
      } catch (e) {
        // If it's not valid JSON, keep as string (social media handles like @user)
        console.log('redesSociais not valid JSON, keeping as string:', redes)
      }
    } else {
      redes = null
    }

    // Prepare imagens/videos arrays from uploaded files
    const imagensArr = filesByField.imagens ? filesByField.imagens.map(f => `${baseUrl}/uploads/${f.filename}`) : []
    const videosArr = filesByField.videos ? filesByField.videos.map(f => `${baseUrl}/uploads/${f.filename}`) : []

    // Prepare block data - only include fields that exist in schema
    const blockData = {
      nome: data.nome,
      descricao: data.descricao || null,
      contato: data.contato || null,
      cidade: data.cidade || null,
      estado: data.estado || null,
      endereco: data.endereco || null,
      formacao: data.formacao || null,
      vertenteFeminista: data.vertenteFeminista || null,
      atividades: data.atividades || null,
      dias: data.dias || null,
      localLat: localLat,
      localLng: localLng,
      foto: data.foto || null,
      redesSociais: redes || null,
      imagens: JSON.stringify(imagensArr),
      videos: JSON.stringify(videosArr),
      ownerId: req.user && req.user.id ? req.user.id : null
    }
    
    const block = await prisma.block.create({ data: blockData })
    res.json(block)
  } catch (error) {
    console.error('Error creating block:', error)
    res.status(500).json({ error: error.message || 'Erro ao criar bloco' })
  }
})

app.put('/api/blocks/:id', authMiddleware, upload.any(), async (req, res) => {
  const { id } = req.params
  const data = req.body
  
  try {
    // Find existing block for authorization
    const existing = await prisma.block.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Not found' })

    const isSiteAdmin = req.user && req.user.email && process.env.SITE_ADMIN_EMAIL && req.user.email.toLowerCase() === process.env.SITE_ADMIN_EMAIL.toLowerCase()

    // If block is owned by the site, only SITE_ADMIN_EMAIL can edit
    if (existing.ownerId === 'site' && !isSiteAdmin) {
      return res.status(403).json({ error: 'Forbidden - owned by site' })
    }

    // If block has an ownerId (user-created) ensure only owner can edit
    if (existing.ownerId && existing.ownerId !== 'site' && existing.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - not owner' })
    }

    // Organize files by field name
    const filesByField = {}
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = []
        }
        filesByField[file.fieldname].push(file)
      })
    }
    
    // Build base URL for served uploads
    const baseUrl = `${req.protocol}://${req.get('host')}`

    if (filesByField.foto && filesByField.foto[0]) {
      data.foto = `${baseUrl}/uploads/${filesByField.foto[0].filename}`
    }
    
    const localLat = data.localLat ? parseFloat(data.localLat) : undefined
    const localLng = data.localLng ? parseFloat(data.localLng) : undefined
    
    // Handle redesSociais - try to parse as JSON, fallback to string
    let redes = data.redesSociais
    if (redes) {
      try {
        redes = JSON.parse(redes)
      } catch (e) {
        // If it's not valid JSON, keep as string
        console.log('redesSociais not valid JSON, keeping as string:', redes)
      }
    } else {
      redes = undefined
    }

    // Prepare imagens/videos arrays from uploaded files (only if provided)
    const imagensArr = filesByField.imagens ? filesByField.imagens.map(f => `${baseUrl}/uploads/${f.filename}`) : undefined
    const videosArr = filesByField.videos ? filesByField.videos.map(f => `${baseUrl}/uploads/${f.filename}`) : undefined

    // Prepare block data - only include fields that exist in schema
    const blockData = {
      nome: data.nome || undefined,
      descricao: data.descricao || undefined,
      contato: data.contato || undefined,
      cidade: data.cidade || undefined,
      estado: data.estado || undefined,
      endereco: data.endereco || undefined,
      formacao: data.formacao || undefined,
      vertenteFeminista: data.vertenteFeminista || undefined,
      atividades: data.atividades || undefined,
      dias: data.dias || undefined,
      localLat: localLat,
      localLng: localLng,
      foto: data.foto || undefined,
      redesSociais: redes || undefined,
      imagens: imagensArr ? JSON.stringify(imagensArr) : undefined,
      videos: videosArr ? JSON.stringify(videosArr) : undefined
    }
    
    const updated = await prisma.block.update({ 
      where: { id }, 
      data: blockData 
    })
    console.log('Block updated successfully:', updated.id)
    res.json(updated)
  } catch (e) {
    console.error('Error updating block:', e)
    res.status(500).json({ error: e.message })
  }
})

app.delete('/api/blocks/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  try {
    const existing = await prisma.block.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Not found' })

    const isSiteAdmin = req.user && req.user.email && process.env.SITE_ADMIN_EMAIL && req.user.email.toLowerCase() === process.env.SITE_ADMIN_EMAIL.toLowerCase()

    if (existing.ownerId === 'site' && !isSiteAdmin) {
      return res.status(403).json({ error: 'Forbidden - owned by site' })
    }

    // Only the owner can delete user-owned blocks
    if (existing.ownerId && existing.ownerId !== 'site' && existing.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - not owner' })
    }

    await prisma.block.delete({ where: { id } })
    res.json({ ok: true })
  } catch (e) {
    res.status(404).json({ error: 'Not found' })
  }
})

// Events CRUD
app.get('/api/events', async (req, res) => {
  const events = await prisma.event.findMany({ include: { bloco: true } })
  res.json(events)
})

// Admin endpoint: list events the current user can manage
app.get('/api/events/admin/list', authMiddleware, async (req, res) => {
  try {
    const isSiteAdmin = req.user && req.user.email && process.env.SITE_ADMIN_EMAIL && req.user.email.toLowerCase() === process.env.SITE_ADMIN_EMAIL.toLowerCase()
    let events
    if (isSiteAdmin) {
      // site admin sees events for site-owned blocks only
      events = await prisma.event.findMany({ where: { bloco: { ownerId: 'site' } }, include: { bloco: true } })
    } else {
      // regular user sees events only for blocks they own
      events = await prisma.event.findMany({ where: { bloco: { ownerId: req.user.id } }, include: { bloco: true } })
    }
    res.json(events)
  } catch (e) {
    console.error('Error fetching admin events:', e)
    res.status(500).json({ error: e.message })
  }
})

// Admin endpoint: get single event only if user can manage it
app.get('/api/events/admin/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  try {
    const event = await prisma.event.findUnique({ where: { id }, include: { bloco: true } })
    if (!event) return res.status(404).json({ error: 'Not found' })
    const bloco = event.bloco
    const isSiteAdmin = req.user && req.user.email && process.env.SITE_ADMIN_EMAIL && req.user.email.toLowerCase() === process.env.SITE_ADMIN_EMAIL.toLowerCase()

    if (bloco.ownerId === 'site' && !isSiteAdmin) {
      return res.status(403).json({ error: 'Forbidden - cannot access events for site-owned blocks' })
    }
    if (bloco.ownerId && bloco.ownerId !== 'site' && bloco.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - not block owner' })
    }
    res.json(event)
  } catch (e) {
    console.error('Error fetching admin event:', e)
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params
  const event = await prisma.event.findUnique({ where: { id }, include: { bloco: true } })
  if (!event) return res.status(404).json({ error: 'Not found' })
  res.json(event)
})

app.post('/api/events', authMiddleware, upload.any(), async (req, res) => {
  try {
    const data = req.body
    
    // Check authorization: user must own the block or be site admin
    const bloco = await prisma.block.findUnique({ where: { id: data.blocoId } })
    if (!bloco) return res.status(404).json({ error: 'Block not found' })
    
    const isSiteAdmin = req.user && req.user.email && process.env.SITE_ADMIN_EMAIL && req.user.email.toLowerCase() === process.env.SITE_ADMIN_EMAIL.toLowerCase()
    
    if (bloco.ownerId === 'site' && !isSiteAdmin) {
      return res.status(403).json({ error: 'Forbidden - cannot create events for site-owned blocks' })
    }

    // Only block owner can create events for user-owned blocks
    if (bloco.ownerId && bloco.ownerId !== 'site' && bloco.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - not block owner' })
    }
    
    // Organize files by field name
    const filesByField = {}
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = []
        }
        filesByField[file.fieldname].push(file)
      })
    }
    
    if (filesByField.foto && filesByField.foto[0]) {
      data.foto = `/uploads/${filesByField.foto[0].filename}`
    }
    // normalize optional fields
    const tipo = data.tipo || null
    const horario = data.horario || null
    
    const event = await prisma.event.create({ 
      data: { 
        nome: data.nome, 
        descricao: data.descricao || null, 
        foto: data.foto || null, 
        blocoId: data.blocoId, 
        data: new Date(data.data), 
        local: data.local || null, 
        cidade: data.cidade || null, 
        estado: data.estado || null,
        tipo: tipo,
        horario: horario
      } 
    })
    res.json(event)
  } catch (e) {
    console.error('Error creating event:', e)
    res.status(500).json({ error: e.message })
  }
})

app.put('/api/events/:id', authMiddleware, upload.any(), async (req, res) => {
  const { id } = req.params
  const data = req.body
  
  try {
    // Find event and its block for authorization
    const event = await prisma.event.findUnique({ where: { id }, include: { bloco: true } })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    
    const bloco = event.bloco
    const isSiteAdmin = req.user && req.user.email && process.env.SITE_ADMIN_EMAIL && req.user.email.toLowerCase() === process.env.SITE_ADMIN_EMAIL.toLowerCase()
    
    if (bloco.ownerId === 'site' && !isSiteAdmin) {
      return res.status(403).json({ error: 'Forbidden - cannot update events for site-owned blocks' })
    }

    // Only block owner can update events for user-owned blocks
    if (bloco.ownerId && bloco.ownerId !== 'site' && bloco.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - not block owner' })
    }
  
    // Organize files by field name
    const filesByField = {}
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = []
        }
        filesByField[file.fieldname].push(file)
      })
    }
    
    if (filesByField.foto && filesByField.foto[0]) data.foto = `/uploads/${filesByField.foto[0].filename}`
    const tipo = data.tipo || undefined
    const horario = data.horario || undefined

    const updated = await prisma.event.update({ 
      where: { id }, 
      data: { 
        nome: data.nome, 
        descricao: data.descricao || null, 
        foto: data.foto || null, 
        blocoId: data.blocoId, 
        data: data.data ? new Date(data.data) : undefined, 
        local: data.local || null, 
        cidade: data.cidade || null, 
        estado: data.estado || null,
        tipo: tipo,
        horario: horario
      } 
    })
    res.json(updated)
  } catch (e) {
    console.error('Error updating event:', e)
    res.status(404).json({ error: e.message })
  }
})

app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  try {
    // Find event and its block for authorization
    const event = await prisma.event.findUnique({ where: { id }, include: { bloco: true } })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    
    const bloco = event.bloco
    const isSiteAdmin = req.user && req.user.email && process.env.SITE_ADMIN_EMAIL && req.user.email.toLowerCase() === process.env.SITE_ADMIN_EMAIL.toLowerCase()

    if (bloco.ownerId === 'site' && !isSiteAdmin) {
      return res.status(403).json({ error: 'Forbidden - cannot delete events for site-owned blocks' })
    }

    // Only block owner can delete events for user-owned blocks
    if (bloco.ownerId && bloco.ownerId !== 'site' && bloco.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - not block owner' })
    }
    
    await prisma.event.delete({ where: { id } })
    res.json({ ok: true })
  } catch (e) {
    res.status(404).json({ error: 'Not found' })
  }
})

// Serve uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')))

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
