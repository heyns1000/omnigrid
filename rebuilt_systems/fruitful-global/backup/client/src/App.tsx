import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import BrandManagement from "@/pages/brand-management";
import TemplateOrchestration from "@/pages/template-orchestration";
import DeploymentControl from "@/pages/deployment-control";
import SecureSign from "@/pages/securesign";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/brands" component={BrandManagement} />
      <Route path="/templates" component={TemplateOrchestration} />
      <Route path="/deployment" component={DeploymentControl} />
      <Route path="/securesign" component={SecureSign} />
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
