import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function validateAuth(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    req.userId = decoded.userId

    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
