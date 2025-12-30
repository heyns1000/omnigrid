import jwt from 'jsonwebtoken'
const bcrypt = require('bcryptjs')
import type { User } from '../../../shared/src'

// In-memory storage (replace with database in production)
const users: Map<string, User & { password: string }> = new Map()

export class AuthService {
  async register(data: {
    email: string
    password: string
    name: string
    country?: string
  }) {
    // Check if user exists
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === data.email
    )
    if (existingUser) {
      const error = new Error('Email already in use') as any
      error.status = 409
      throw error
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user
    const userId = `user_${Date.now()}`
    const user: User & { password: string } = {
      id: userId,
      email: data.email,
      name: data.name,
      country: data.country,
      password: hashedPassword,
      preferences: {
        theme: 'light',
        notifications: true,
      },
    }

    users.set(userId, user)

    // Generate token
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    const { password, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  }

  async login(email: string, password: string) {
    // Find user
    const user = Array.from(users.values()).find((u) => u.email === email)
    if (!user) {
      const error = new Error('Invalid credentials') as any
      error.status = 401
      throw error
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      const error = new Error('Invalid credentials') as any
      error.status = 401
      throw error
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  }

  async getUser(userId: string) {
    const user = users.get(userId)
    if (!user) {
      const error = new Error('User not found') as any
      error.status = 404
      throw error
    }

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
