import { useQuery, useMutation } from '@tanstack/react-query'

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

export interface AuthError {
  message: string
  code?: string
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: Infinity,
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Login failed')
      }
      return response.json()
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: {
      email: string
      password: string
      name: string
      country?: string
    }) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Registration failed')
      }
      return response.json()
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Logout failed')
      }
      return response.json()
    },
  })

  return {
    user,
    isLoading,
    error: error as AuthError | null,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  }
}
