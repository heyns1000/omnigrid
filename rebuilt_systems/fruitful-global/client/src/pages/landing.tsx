import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sprout, Eye, Globe, Zap } from "lucide-react";
import { Link } from "wouter";
import fruitfulLogo from "@assets/Fruiful_1757075797113.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-teal-900/20">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-teal-400/10 animate-pulse"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src={fruitfulLogo} 
              alt="Fruitful Global™" 
              className="h-24 w-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
              data-testid="img-fruitful-logo"
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent leading-tight" data-testid="text-main-headline">
            We Can See
            <br />
            <span className="text-amber-500">The Seed</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-subheadline">
            Nurturing tomorrow's innovations across global sectors through 
            <span className="font-semibold text-green-600 dark:text-green-400"> unified orchestration</span>, 
            <span className="font-semibold text-emerald-600 dark:text-emerald-400"> authentic growth</span>, and 
            <span className="font-semibold text-teal-600 dark:text-teal-400"> sustainable impact</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-explore-ecosystem"
              >
                <Sprout className="mr-2 h-5 w-5" />
                Explore Ecosystem
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/admin">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
                data-testid="button-admin-portal"
              >
                <Globe className="mr-2 h-5 w-5" />
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200" data-testid="text-vision-title">
            The Seed of Innovation
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" data-testid="card-vision-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200" data-testid="text-vision-1-title">
                  We See Potential
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed" data-testid="text-vision-1-description">
                  Every seed contains infinite possibilities. We identify and nurture the hidden potential in every sector, every brand, every innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" data-testid="card-vision-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sprout className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200" data-testid="text-vision-2-title">
                  We Cultivate Growth
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed" data-testid="text-vision-2-description">
                  Through strategic orchestration and authentic development, we provide the environment where seeds transform into thriving ecosystems.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" data-testid="card-vision-3">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200" data-testid="text-vision-3-title">
                  We Amplify Impact
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed" data-testid="text-vision-3-description">
                  From local roots to global reach, we scale sustainable solutions that create lasting positive change across all sectors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Ecosystem Preview */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800 dark:text-gray-200" data-testid="text-ecosystem-title">
            Multi-Brand Global Ecosystem
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm hover:shadow-lg transition-all duration-300" data-testid="card-brand-seedwave">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="font-bold text-green-600 dark:text-green-400" data-testid="text-brand-seedwave">Seedwave™</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Analytics Hub</p>
            </div>
            
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm hover:shadow-lg transition-all duration-300" data-testid="card-brand-vaultmesh">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="font-bold text-blue-600 dark:text-blue-400" data-testid="text-brand-vaultmesh">VaultMesh™</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Payment Systems</p>
            </div>
            
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm hover:shadow-lg transition-all duration-300" data-testid="card-brand-banimal">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-bold text-purple-600 dark:text-purple-400" data-testid="text-brand-banimal">Banimal™</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interactive Features</p>
            </div>
            
            <div className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm hover:shadow-lg transition-all duration-300" data-testid="card-brand-fruitful">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400" data-testid="text-brand-fruitful">Fruitful Global™</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Orchestration Platform</p>
            </div>
          </div>

          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-view-dashboard"
            >
              <Globe className="mr-2 h-5 w-5" />
              View Global Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <img 
              src={fruitfulLogo} 
              alt="Fruitful Global™" 
              className="h-12 w-auto mx-auto opacity-80"
              data-testid="img-footer-logo"
            />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4" data-testid="text-footer-tagline">
            Where Every Seed Becomes a Forest
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500" data-testid="text-footer-copyright">
            © 2025 Fruitful Global™. Multi-Brand Orchestration Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}