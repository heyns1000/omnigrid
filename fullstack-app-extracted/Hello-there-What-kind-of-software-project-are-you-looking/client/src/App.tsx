import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/landing";
import BrandManagement from "@/pages/brand-management";
import TemplateOrchestration from "@/pages/template-orchestration";
import DeploymentControl from "@/pages/deployment-control";
import Analytics from "@/pages/analytics";
import AIStudio from "@/pages/ai-studio";
import Marketplace from "@/pages/marketplace";
import Collaboration from "@/pages/collaboration";
import Automation from "@/pages/automation";
import Monitoring from "@/pages/monitoring";
import Workflows from "@/pages/workflows";
import Integrations from "@/pages/integrations";
import Compliance from "@/pages/compliance";
import Performance from "@/pages/performance";
import GlobalOps from "@/pages/global-ops";
import PythonDeploy from "@/pages/python-deploy";
import SecureSign from "@/pages/securesign";
import FaaShells from "@/pages/FaaShells";
import OmniGridCanvas from "@/pages/omnigrid-canvas";
// Fruitful-integrated pages
import SectorsPortal from "@/pages/sectors-portal";
import BaobabTerminal from "@/pages/baobab";
import VaultMeshPortal from "@/pages/vaultmesh-portal";
import TreatySystem from "@/pages/treaty";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/brands" component={BrandManagement} />
      <Route path="/templates" component={TemplateOrchestration} />
      <Route path="/deployment" component={DeploymentControl} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/ai-studio" component={AIStudio} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/collaboration" component={Collaboration} />
      <Route path="/automation" component={Automation} />
      <Route path="/monitoring" component={Monitoring} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/performance" component={Performance} />
      <Route path="/global-ops" component={GlobalOps} />
      <Route path="/python-deploy" component={PythonDeploy} />
      <Route path="/securesign" component={SecureSign} />
      <Route path="/faa-shells" component={FaaShells} />
      <Route path="/omnigrid-canvas" component={OmniGridCanvas} />
      {/* Fruitful-integrated routes */}
      <Route path="/sectors-portal" component={SectorsPortal} />
      <Route path="/baobab" component={BaobabTerminal} />
      <Route path="/vaultmesh-portal" component={VaultMeshPortal} />
      <Route path="/treaty" component={TreatySystem} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  useEffect(() => {
    const routeTitles: Record<string, string> = {
      "/": "Overview",
      "/dashboard": "Dashboard",
      "/admin": "Admin",
      "/brands": "Brands",
      "/templates": "Templates",
      "/deployment": "Deployment Control",
      "/analytics": "Analytics",
      "/ai-studio": "AI Studio",
      "/marketplace": "Marketplace",
      "/automation": "Automation",
      "/monitoring": "Monitoring",
      "/workflows": "Workflows",
      "/integrations": "Integrations",
      "/compliance": "Compliance",
      "/performance": "Performance",
      "/global-ops": "Global Ops",
      "/python-deploy": "Python Deploy",
      "/securesign": "SecureSign™",
      "/faa-shells": "FAA™ Shells",
      "/omnigrid-canvas": "OmniGrid Canvas",
      "/sectors-portal": "Sectors Portal",
      "/baobab": "Baobab Terminal",
      "/vaultmesh-portal": "VaultMesh™",
      "/treaty": "Treaty System™",
    };

    const section = routeTitles[location] || "Platform";
    document.title = `${section} | OmniGrid™`;
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fruitful-ui-theme">
        <TooltipProvider>
          <ErrorBoundary>
            <div className="min-h-screen bg-background text-foreground">
              <GlobalHeader />
              <main>
                <ErrorBoundary>
                  <Router />
                </ErrorBoundary>
              </main>
              <GlobalFooter />
            </div>
          </ErrorBoundary>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
