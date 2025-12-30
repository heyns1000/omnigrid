export interface User {
  id: string
  email: string
  name: string
  country?: string
  preferences?: {
    theme?: 'light' | 'dark'
    notifications?: boolean
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  country?: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export interface ErrorResponse {
  message: string
  code?: string
}
