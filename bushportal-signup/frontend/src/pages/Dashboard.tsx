import { useLocation } from 'wouter'
import { TreePine, LogOut } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '../../../shared/src'

export default function DashboardPage() {
  const [, setLocation] = useLocation()
  const { user, logout } = useAuth()
  const typedUser = user as unknown as User | undefined

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setLocation('/')
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-amber-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TreePine className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              BushPortal™
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Welcome to BushPortal™</CardTitle>
            <CardDescription>
              You've successfully joined our digital tree house network
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {typedUser?.name || 'Guest'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {typedUser?.email || 'guest@bushportal.local'}
                </p>
              </div>
              {typedUser?.country && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Country</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {typedUser.country}
                  </p>
                </div>
              )}

              <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  🌍 Welcome to Our Community
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  You're now part of a global network of 120+ countries connecting
                  through our digital tree house. Explore podcasts, communities, and
                  environmental dashboards to make an impact.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
