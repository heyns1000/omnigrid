import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BrandCard from "@/components/BrandCard";
import AnalyticsChart from "@/components/AnalyticsChart";
import GlobalMap from "@/components/GlobalMap";
import SectorNavigation from "@/components/SectorNavigation";
import { Activity, Users, Layout, Zap } from "lucide-react";

export default function Dashboard() {
  // Template management dashboard with navigation to authentic templates

  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["/api/brands"],
  });

  const { data: sectors = [], isLoading: sectorsLoading } = useQuery({
    queryKey: ["/api/sectors"],
  });

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const { data: deployments = [], isLoading: deploymentsLoading } = useQuery({
    queryKey: ["/api/deployments"],
  });

  const activeBrands = brands.filter((brand: any) => brand.status === "active");
  const activeSectors = sectors.filter((sector: any) => sector.status === "active");
  const activeTemplates = templates.filter((template: any) => template.isActive);
  const successfulDeployments = deployments.filter((deployment: any) => deployment.deploymentStatus === "deployed");

  const keyMetrics = [
    {
      title: "Active Sectors",
      value: activeSectors.length,
      icon: Activity,
      status: "online" as const,
      description: "Operational sectors"
    },
    {
      title: "Core Brands",
      value: activeBrands.length,
      icon: Users,
      status: "online" as const,
      description: "Portfolio brands"
    },
    {
      title: "Global Templates",
      value: activeTemplates.length,
      icon: Layout,
      status: "online" as const,
      description: "Template system"
    },
    {
      title: "Deployments",
      value: successfulDeployments.length,
      icon: Zap,
      status: "online" as const,
      description: "Successful deployments"
    }
  ];

  if (brandsLoading || sectorsLoading || templatesLoading || deploymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6 gradient-text animate-fade-in">
            Complete Brand Ecosystem
            <br />
            Orchestration Platform
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
            Deploy and manage your entire portfolio of global templates across 29+ sectors with intelligent brand customization, unified analytics, and scalable architecture.
          </p>
          
          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {keyMetrics.map((metric, index) => (
              <Card key={metric.title} className="dashboard-widget text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-4">
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground mb-2">{metric.description}</div>
                  <Badge variant={metric.status === "online" ? "default" : "secondary"} className="text-xs">
                    <div className={`status-indicator status-${metric.status} mr-1`}></div>
                    Active
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Portfolio Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Brand Portfolio Integration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {activeBrands.length > 0 ? (
              activeBrands.map((brand: any, index: number) => (
                <BrandCard 
                  key={brand.id} 
                  brand={brand} 
                  delay={index * 0.1}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No active brands found. Add brands to get started.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sector Navigation Section */}
      <section className="py-16 px-6 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Sector Navigation System</h3>
          <SectorNavigation sectors={activeSectors} />
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Real-time Analytics</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Analytics Chart */}
            <Card className="dashboard-widget">
              <CardHeader>
                <CardTitle>Deployment Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsChart />
              </CardContent>
            </Card>

            {/* Sector Performance */}
            <Card className="dashboard-widget">
              <CardHeader>
                <CardTitle>Sector Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSectors.slice(0, 4).map((sector: any) => (
                    <div key={sector.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{sector.name}</span>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-secondary rounded-full mr-2">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 40) + 60}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Map */}
          <Card className="dashboard-widget mt-8">
            <CardHeader>
              <CardTitle>Global Deployment Map</CardTitle>
            </CardHeader>
            <CardContent>
              <GlobalMap />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
