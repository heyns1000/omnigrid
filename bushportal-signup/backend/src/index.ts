import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRouter } from './routes/auth'
import { errorHandler } from './middleware/errorHandler'
import { logger } from './middleware/logger'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(logger)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRouter)

// Error handling
app.use(errorHandler)

// Start server
app.listen(port, () => {
  console.log(`✅ BushPortal Signup Backend running on http://localhost:${port}`)
})

export default app
