import { useState } from 'react'
import { useLocation } from 'wouter'
import { TreePine, Lock, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoggingIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(
        { email, password },
        {
          onSuccess: () => {
            setLocation('/dashboard')
          },
          onError: (err: Error) => {
            setError(err instanceof Error ? err.message : 'Login failed')
          },
        }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleGuestAccess = () => {
    setLocation('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TreePine className="w-12 h-12 text-amber-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                BushPortal™
              </h1>
              <p className="text-sm text-amber-600 dark:text-amber-300">
                Digital Tree House Network
              </p>
            </div>
          </div>
          <Badge variant="outline">🌍 From Here to Timbuktu</Badge>
        </div>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to access your BushPortal dashboard and community.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              <Input
                icon={<Mail className="w-4 h-4" />}
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />

              <Input
                icon={<Lock className="w-4 h-4" />}
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoggingIn}
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue as
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGuestAccess}
                className="w-full"
              >
                Guest Access
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <button
                onClick={() => setLocation('/register')}
                className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                Create one now
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
