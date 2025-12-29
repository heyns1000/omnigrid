import { Link } from "wouter";

export default function GlobalFooter() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold gradient-text">🌐 Fruitful Global™</h3>
            <p className="text-sm text-muted-foreground">
              Multi-Brand Orchestration Platform powering 29+ sectors with 
              unlimited brands and subnodes.
            </p>
          </div>

          {/* Core Brands */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Core Brands</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>🌱 <span className="text-green-600">Seedwave™</span> - Analytics Hub</div>
              <div>🔒 <span className="text-blue-600">VaultMesh™</span> - Checkout Systems</div>
              <div>🎯 <span className="text-orange-600">Banimal™</span> - Interactive Features</div>
              <div>🛡️ <span className="text-amber-600">SecureSign™</span> - Legal Engine</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Navigation</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors">
                Dashboard Overview
              </Link>
              <Link href="/brands" className="block text-muted-foreground hover:text-foreground transition-colors">
                Brand Management
              </Link>
              <Link href="/templates" className="block text-muted-foreground hover:text-foreground transition-colors">
                Template Orchestration
              </Link>
              <Link href="/deployment" className="block text-muted-foreground hover:text-foreground transition-colors">
                Deployment Control
              </Link>
              <Link href="/securesign" className="block text-muted-foreground hover:text-foreground transition-colors">
                SecureSign™ Portal
              </Link>
            </div>
          </div>

          {/* Legal & Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Platform Info</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Template Versioning</div>
              <div>Multi-Brand Deployment</div>
              <div>Global Analytics</div>
              <div>FAA™ NDA Portal</div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Fruitful Global™. All rights reserved. Multi-Brand Orchestration Platform.
          </p>
          <p className="text-xs text-muted-foreground mt-2 md:mt-0">
            Powered by SecureSign™ Smart Legal Signature Engine
          </p>
        </div>
      </div>
    </footer>
  );
}