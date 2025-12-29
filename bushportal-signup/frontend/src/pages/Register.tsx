import { useState } from 'react'
import { useLocation } from 'wouter'
import { TreePine, UserPlus, User, Mail, Lock, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const [, setLocation] = useLocation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { register, isRegistering } = useAuth()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required'
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await register(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          country: formData.country,
        },
        {
          onSuccess: () => {
            setLocation('/dashboard')
          },
          onError: (err: Error) => {
            setErrors({
              submit: err instanceof Error ? err.message : 'Registration failed',
            })
          },
        }
      )
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'An error occurred',
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
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
          <Badge variant="outline">🌍 Join Our Global Community</Badge>
        </div>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" />
              Create Account
            </CardTitle>
            <CardDescription>
              Join podcasters from 120 countries across our baobab tree house network.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {errors.submit && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200 text-sm">
                  {errors.submit}
                </div>
              )}

              <Input
                icon={<User className="w-4 h-4" />}
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                data-testid="input-name"
              />

              <Input
                icon={<Mail className="w-4 h-4" />}
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                data-testid="input-email"
              />

              <Input
                icon={<Globe className="w-4 h-4" />}
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                error={errors.country}
                data-testid="input-country"
              />

              <Input
                icon={<Lock className="w-4 h-4" />}
                type="password"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                data-testid="input-password"
              />

              <Input
                icon={<Lock className="w-4 h-4" />}
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                data-testid="input-confirm-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isRegistering}
                className="w-full"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => setLocation('/')}
                className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                Sign in
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
