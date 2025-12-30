import { useLocation } from 'wouter'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const [location] = useLocation()
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-amber-300 border-t-amber-600 rounded-full"></div>
          </div>
          <p className="mt-4 text-amber-600 dark:text-amber-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is logged in and not logging out, show dashboard
  if (user && location !== '/logout') {
    return <DashboardPage />
  }

  // Route to specific pages
  if (location === '/register') {
    return <RegisterPage />
  }

  if (location === '/login') {
    return <LoginPage />
  }

  if (location === '/dashboard' && user) {
    return <DashboardPage />
  }

  // Default: show landing page
  return <LandingPage />
}
