import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import prisma from '../server/prismaClient.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// CORS configuration
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://localhost:8080', 
    'http://localhost:8081',
    'http://26.236.240.201:8080', 
    'http://26.236.240.201:8081', 
    'http://26.236.240.201:8082', 
    'http://26.236.240.201:8083', 
    'http://192.168.15.67:8080', 
    'http://192.168.15.67:8081',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    process.env.VITE_API_URL || ''
  ].filter(Boolean), 
  credentials: true 
}))
app.options('*', cors())

app.use(express.json())
app.use(cookieParser())

// Storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use /tmp for Vercel serverless (ephemeral storage)
    cb(null, '/tmp')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

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
    jwt.verify(token, JWT_SECRET)
    const data = jwt.decode(token)
    req.user = data
    next()
  } catch (e) {
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
    }
  }
}

// Import routes from server
import('../server/index.js').then(module => {
  // Re-export app or just use it as is
}).catch(err => {
  console.error('Error importing routes:', err)
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Admin endpoint: Get only blocks user can manage
app.get('/api/blocks/admin/list', authMiddleware, async (req, res) => {
  try {
    const blocks = await prisma.block.findMany({
      where: { ownerId: req.user.id }
    })
    res.json(blocks)
  } catch (e) {
    console.error('Error fetching admin blocks:', e)
    res.status(500).json({ error: e.message })
  }
})

// Get all public blocks
app.get('/api/blocks', async (req, res) => {
  try {
    const blocks = await prisma.block.findMany()
    res.json(blocks)
  } catch (e) {
    console.error('Error fetching blocks:', e)
    res.status(500).json({ error: e.message })
  }
})

export default app
