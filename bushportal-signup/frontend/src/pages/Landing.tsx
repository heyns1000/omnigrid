import { useLocation } from 'wouter'
import { TreePine, Users, Globe2, Shield, Zap, ArrowRight, Heart, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function LandingPage() {
  const [, setLocation] = useLocation()

  const features = [
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "Global Network",
      description: "Connect from here to Timbuktu and everywhere in between"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Join a vibrant community of digital nomads and creators"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Enterprise-grade security protecting your digital space"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Instant access to your tree house from anywhere"
    }
  ]

  const stats = [
    { value: "149+", label: "Global Brands" },
    { value: "24K+", label: "Active Members" },
    { value: "94", label: "Repositories" },
    { value: "∞", label: "Possibilities" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <TreePine className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  BushPortal™
                </h1>
                <p className="text-xs text-amber-600 dark:text-amber-300">
                  Digital Tree House Network
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setLocation('/login')}
                className="text-amber-900 dark:text-amber-100"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                onClick={() => setLocation('/register')}
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Badge variant="outline" className="mb-6 text-amber-700 dark:text-amber-300 border-amber-300">
              <Sparkles className="w-3 h-3 mr-1" />
              🌍 From Here to Timbuktu
            </Badge>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-amber-900 dark:text-amber-100 mb-6 leading-tight">
              Your Digital
              <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Tree House
              </span>
              Awaits
            </h2>

            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Join the BushPortal™ community and access a global network of digital creators,
              innovators, and dreamers. Build your presence across 94 repositories and 149 brands.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="primary"
                onClick={() => setLocation('/register')}
                className="group"
              >
                Create Your Tree House
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation('/login')}
              >
                Explore as Guest
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200 dark:border-gray-700">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                Why BushPortal™?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                More than just a platform - it's your digital ecosystem
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold text-lg text-amber-900 dark:text-amber-100 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-amber-600 to-orange-600 border-0 max-w-4xl mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <Heart className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Build Your Digital Legacy?
              </h3>
              <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
                Join thousands of creators, developers, and innovators who've made BushPortal™ their digital home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setLocation('/register')}
                  className="bg-white text-amber-900 hover:bg-gray-100"
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation('/login')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-16 text-gray-600 dark:text-gray-400 text-sm">
            <p>Built with <Heart className="w-4 h-4 inline text-red-500" /> for the BushPortal™ Global Community</p>
            <p className="mt-2">Part of the 149-brand FAA™ Ecosystem • CodeNest™ Integration</p>
          </div>
        </div>
      </div>
    </div>
  )
}
