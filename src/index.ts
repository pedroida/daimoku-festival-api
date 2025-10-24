import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

// Middleware
app.use(express.json())

app.use(cors())

app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  const apiKey = req.headers['api-key']
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
})

// Home route - HTML
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/api/distritos">Distritos</a>
          <a href="/api/daimokus">Daimokus</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Daimoku Festival API 🚀</h1>
        <p>This is a festival management API with Prisma ORM and PostgreSQL database.</p>
        <h2>Available Endpoints:</h2>
        <ul>
          <li><a href="/api/distritos">GET /api/distritos</a> - List all districts</li>
          <li><a href="/api/daimokus">GET /api/daimokus</a> - List all daimokus</li>
          <li>POST /api/distritos - Create a new district</li>
          <li>POST /api/daimokus - Create a new daimoku</li>
        </ul>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

// API endpoints for Distrito
app.get('/api/distritos', async (req, res) => {
  try {
    const distritos = await prisma.distrito.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        daimokus: true
      }
    })
    res.json(distritos)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distritos' })
  }
})

app.post('/api/distritos', async (req, res) => {
  try {
    const { name } = req.body
    // find with ilike
    const existingDistrito = await prisma.distrito.findFirst({
      where: { name: { contains: (name || '').trim(), mode: 'insensitive' } }
    })
    if (existingDistrito) {
      return res.status(400).json({ error: 'Este distrito já foi adicionado.' })
    }

    const distrito = await prisma.distrito.create({
      data: { name: (name || '').trim() }
    })
    res.json(distrito)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create distrito' })
  }
})

app.get('/api/daimokus/total-minutes', async (req, res) => {
  try {
    const totalHours = await prisma.daimoku.aggregate({
      _sum: { minutes: true }
    })
    res.json(totalHours._sum.minutes)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch total minutes' })
  }
})

// API endpoints for Daimoku
app.get('/api/daimokus', async (req, res) => {
  try {
    const daimokus = await prisma.daimoku.findMany({
      include: {
        distrito: true
      }
    })
    res.json(daimokus)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daimokus' })
  }
})

app.post('/api/daimokus', async (req, res) => {
  try {
    const { memberCode, memberName, distritoId, date, minutes } = req.body
    const daimoku = await prisma.daimoku.create({
      data: {
        memberCode,
        memberName,
        date: new Date(date),
        minutes,
        distritoId
      },
    })
    res.json(daimoku)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create daimoku' })
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`)
})

export default app
