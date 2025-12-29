import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fruitful-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <GlobalHeader />
            <main>
              <Router />
            </main>
            <GlobalFooter />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
