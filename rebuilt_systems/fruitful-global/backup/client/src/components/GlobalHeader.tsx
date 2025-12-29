import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function GlobalHeader() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Overview", icon: "🏠" },
    { path: "/brands", label: "Brands", icon: "🏷️" },
    { path: "/templates", label: "Templates", icon: "📋" },
    { path: "/deployment", label: "Deployment", icon: "🚀" },
    { path: "/securesign", label: "SecureSign™", icon: "🛡️" },
  ];

  return (
    <header className="global-header">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold gradient-text">🌐 Fruitful Global™</h1>
            <span className="text-sm text-muted-foreground">Multi-Brand Orchestration Platform</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "default" : "ghost"}
                  size="sm"
                  className="text-sm font-medium transition-colors"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Theme Controls */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
