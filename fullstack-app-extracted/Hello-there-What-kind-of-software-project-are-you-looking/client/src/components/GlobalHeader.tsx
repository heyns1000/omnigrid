import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "./ThemeToggle";
import fruitfulLogo from "@assets/Fruiful_1757075797113.png";

export default function GlobalHeader() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Overview", icon: "🏠" },
    { path: "/brands", label: "Brands", icon: "🏷️" },
    { path: "/templates", label: "Templates", icon: "📋" },
    { path: "/deployment", label: "Deployment", icon: "🚀" },
    { path: "/analytics", label: "Analytics", icon: "📊" },
    { path: "/ai-studio", label: "AI Studio", icon: "🤖" },
    { path: "/marketplace", label: "Marketplace", icon: "🛒" },
    { path: "/collaboration", label: "Collaboration", icon: "👥" },
    { path: "/automation", label: "Automation", icon: "⚡" },
    { path: "/monitoring", label: "Monitoring", icon: "📡" },
    { path: "/workflows", label: "Workflows", icon: "🔄" },
    { path: "/integrations", label: "Integrations", icon: "🔗" },
    { path: "/compliance", label: "Compliance", icon: "✅" },
    { path: "/performance", label: "Performance", icon: "⚡" },
    { path: "/global-ops", label: "Global Ops", icon: "🌍" },
    { path: "/python-deploy", label: "Python Engine", icon: "🐍" },
    { path: "/omnigrid-canvas", label: "OmniGrid Canvas", icon: "🧬" },
    { path: "/securesign", label: "SecureSign™", icon: "🛡️" },
    { path: "/faa-shells", label: "FAA™ Shells", icon: "🌀" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="header-global">
      {/* Top Brand Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={fruitfulLogo} alt="Fruitful Global™" className="h-6 w-auto" data-testid="img-header-logo" />
            <span className="text-sm font-medium">Multi-Brand Orchestration Platform</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">OmniGrid™</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs opacity-80">29+ Sectors • 4 Core Brands</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center space-x-1 overflow-x-auto" data-testid="nav-main">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "default" : "ghost"}
                  size="sm"
                  className="shrink-0 text-sm font-medium transition-colors hover:bg-muted"
                  data-testid={`nav-${item.label.toLowerCase().replace(/[™\s]/g, '-')}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
