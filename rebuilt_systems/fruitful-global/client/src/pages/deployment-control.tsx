import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { 
  Rocket, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause, 
  RefreshCw,
  CloudUpload,
  Eye,
  ExternalLink
} from "lucide-react";
import type { TemplateDeployment, Brand, Template } from "@shared/schema";

export default function DeploymentControl() {
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const { toast } = useToast();

  const { data: deployments = [], isLoading: deploymentsLoading } = useQuery({
    queryKey: ["/api/deployments"],
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["/api/brands"],
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["/api/templates"],
  });

  const deployTemplateMutation = useMutation({
    mutationFn: async (deploymentId: string) => {
      const response = await apiRequest("PUT", `/api/deployments/${deploymentId}/deploy`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deployments"] });
      toast({
        title: "Success",
        description: "Template deployed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to deploy template",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deployed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredDeployments = selectedBrand === "all" 
    ? deployments 
    : deployments.filter((deployment: TemplateDeployment) => deployment.brandId === selectedBrand);

  const deploymentStats = {
    total: deployments.length,
    deployed: deployments.filter((d: TemplateDeployment) => d.deploymentStatus === "deployed").length,
    pending: deployments.filter((d: TemplateDeployment) => d.deploymentStatus === "pending").length,
    failed: deployments.filter((d: TemplateDeployment) => d.deploymentStatus === "failed").length,
  };

  const successRate = deploymentStats.total > 0 
    ? Math.round((deploymentStats.deployed / deploymentStats.total) * 100) 
    : 0;

  if (deploymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Deployment Control</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage template deployments across all brands and sectors
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button className="flex items-center gap-2 pulse-animation">
              <CloudUpload className="h-4 w-4" />
              Deploy All Updates
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview All Brands
            </Button>
          </div>
        </div>

        {/* Deployment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-widget">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Deployments</p>
                  <p className="text-2xl font-bold">{deploymentStats.total}</p>
                </div>
                <Rocket className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-widget">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Successful</p>
                  <p className="text-2xl font-bold text-green-600">{deploymentStats.deployed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-widget">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{deploymentStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-widget">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{successRate}%</p>
                </div>
                <div className="w-full mt-2">
                  <Progress value={successRate} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedBrand === "all" ? "default" : "outline"}
            onClick={() => setSelectedBrand("all")}
            size="sm"
          >
            All Brands ({deployments.length})
          </Button>
          {brands.map((brand: Brand) => {
            const count = deployments.filter((d: TemplateDeployment) => d.brandId === brand.id).length;
            return (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.id ? "default" : "outline"}
                onClick={() => setSelectedBrand(brand.id)}
                size="sm"
              >
                <span className="mr-2">{brand.icon}</span>
                {brand.name} ({count})
              </Button>
            );
          })}
        </div>

        {/* Deployment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Global Template Deployment */}
          <Card className="dashboard-widget">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Global Template Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.slice(0, 3).map((template: Template) => {
                  const templateDeployments = deployments.filter(
                    (d: TemplateDeployment) => d.templateId === template.id
                  );
                  const deployedCount = templateDeployments.filter(
                    (d: TemplateDeployment) => d.deploymentStatus === "deployed"
                  ).length;
                  const status = deployedCount === templateDeployments.length ? "deployed" : "pending";
                  
                  return (
                    <div 
                      key={template.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        status === "deployed" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {status === "deployed" 
                              ? `Deployed to ${deployedCount} locations`
                              : `Updating ${templateDeployments.length - deployedCount} of ${templateDeployments.length} locations`
                            }
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(status)}>
                        {status === "deployed" ? "Active" : "Updating"}
                      </Badge>
                    </div>
                  );
                })}

                <Button className="w-full mt-4">
                  <CloudUpload className="h-4 w-4 mr-2" />
                  Deploy All Updates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Brand Preview System */}
          <Card className="dashboard-widget">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Brand Preview System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brands.slice(0, 3).map((brand: Brand) => (
                  <div key={brand.id} className="border border-border rounded-lg overflow-hidden">
                    <div 
                      className="p-3 text-white"
                      style={{ 
                        background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.primaryColor}dd)` 
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{brand.name} Preview</span>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-2">Templates Applied:</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Header v2.1.4</Badge>
                        <Badge variant="outline" className="text-xs">Analytics v1.8.3</Badge>
                        <Badge variant="outline" className="text-xs">Payment Hub</Badge>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-4">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview All Brands
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deployment History */}
        <Card className="dashboard-widget">
          <CardHeader>
            <CardTitle>Deployment History</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDeployments.length > 0 ? (
              <div className="space-y-4">
                {filteredDeployments.map((deployment: TemplateDeployment) => {
                  const brand = brands.find((b: Brand) => b.id === deployment.brandId);
                  const template = templates.find((t: Template) => t.id === deployment.templateId);
                  
                  return (
                    <div 
                      key={deployment.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(deployment.deploymentStatus)}
                        <div>
                          <div className="font-medium">
                            {template?.name || "Unknown Template"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Brand: {brand?.name || "Unknown"} • 
                            Created: {new Date(deployment.createdAt).toLocaleDateString()}
                            {deployment.deployedAt && (
                              <> • Deployed: {new Date(deployment.deployedAt).toLocaleDateString()}</>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(deployment.deploymentStatus)}>
                          {deployment.deploymentStatus}
                        </Badge>
                        
                        {deployment.deploymentStatus === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => deployTemplateMutation.mutate(deployment.id)}
                            disabled={deployTemplateMutation.isPending}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Deploy
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Rocket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No deployments found for the selected filter.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
