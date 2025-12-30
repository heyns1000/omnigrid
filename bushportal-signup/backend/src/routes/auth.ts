import { Router, Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/authService'
import { validateAuth } from '../middleware/validateAuth'
import type { LoginRequest, RegisterRequest } from '../../../shared/src'

export const authRouter: Router = Router()
const authService = new AuthService()

// Register
authRouter.post(
  '/register',
  async (req: Request<never, never, RegisterRequest>, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, country } = req.body

      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const result = await authService.register({
        email,
        password,
        name,
        country,
      })

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(201).json({
        user: result.user,
        message: 'Registration successful',
      })
    } catch (error) {
      next(error)
    }
  }
)

// Login
authRouter.post(
  '/login',
  async (req: Request<never, never, LoginRequest>, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' })
      }

      const result = await authService.login(email, password)

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res.json({
        user: result.user,
        message: 'Login successful',
      })
    } catch (error) {
      next(error)
    }
  }
)

// Get current user
authRouter.get(
  '/user',
  validateAuth,
  async (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getUser(req.userId || '')
      res.json(user)
    } catch (error) {
      next(error)
    }
  }
)

// Logout
authRouter.post(
  '/logout',
  (req: Request, res: Response) => {
    res.clearCookie('token')
    res.json({ message: 'Logged out successfully' })
  }
)
