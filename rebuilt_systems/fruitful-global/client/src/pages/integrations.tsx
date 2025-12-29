import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Search, Settings, CheckCircle, AlertCircle, Plus, Zap, Shield } from "lucide-react";

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const integrations = [
    {
      id: 1,
      name: "Slack",
      description: "Team communication and notifications",
      category: "Communication",
      status: "connected",
      icon: "💬",
      features: ["Real-time notifications", "Workflow alerts", "Team collaboration"],
      setupComplexity: "Easy",
      monthlyUsage: "2,847 messages"
    },
    {
      id: 2,
      name: "GitHub",
      description: "Version control and code repository management",
      category: "Development",
      status: "connected",
      icon: "🐙",
      features: ["Auto-deployment", "Issue tracking", "Code reviews"],
      setupComplexity: "Medium",
      monthlyUsage: "156 commits"
    },
    {
      id: 3,
      name: "AWS S3",
      description: "Cloud storage for assets and backups",
      category: "Infrastructure",
      status: "connected",
      icon: "☁️",
      features: ["Asset storage", "Automated backups", "CDN integration"],
      setupComplexity: "Medium",
      monthlyUsage: "847 GB stored"
    },
    {
      id: 4,
      name: "Stripe",
      description: "Payment processing and billing management",
      category: "Finance",
      status: "available",
      icon: "💳",
      features: ["Payment processing", "Subscription billing", "Financial reporting"],
      setupComplexity: "Medium",
      monthlyUsage: "Not connected"
    },
    {
      id: 5,
      name: "Google Analytics",
      description: "Web analytics and user behavior tracking",
      category: "Analytics",
      status: "connected",
      icon: "📊",
      features: ["User tracking", "Conversion analytics", "Traffic insights"],
      setupComplexity: "Easy",
      monthlyUsage: "2.4M pageviews"
    },
    {
      id: 6,
      name: "Twilio",
      description: "SMS and voice communication services",
      category: "Communication",
      status: "available",
      icon: "📱",
      features: ["SMS notifications", "Voice calls", "WhatsApp integration"],
      setupComplexity: "Medium",
      monthlyUsage: "Not connected"
    },
    {
      id: 7,
      name: "SendGrid",
      description: "Email delivery and marketing automation",
      category: "Communication",
      status: "connected",
      icon: "📧",
      features: ["Transactional emails", "Marketing campaigns", "Email analytics"],
      setupComplexity: "Easy",
      monthlyUsage: "12,456 emails"
    },
    {
      id: 8,
      name: "Docker Hub",
      description: "Container registry and deployment",
      category: "Infrastructure",
      status: "available",
      icon: "🐋",
      features: ["Container storage", "Automated builds", "Image scanning"],
      setupComplexity: "Hard",
      monthlyUsage: "Not connected"
    }
  ];

  const categories = [
    { id: "all", name: "All Integrations", count: integrations.length },
    { id: "Communication", name: "Communication", count: 3 },
    { id: "Development", name: "Development", count: 1 },
    { id: "Infrastructure", name: "Infrastructure", count: 2 },
    { id: "Finance", name: "Finance", count: 1 },
    { id: "Analytics", name: "Analytics", count: 1 }
  ];

  const workflows = [
    {
      name: "Deploy to Production",
      integrations: ["GitHub", "AWS S3", "Slack"],
      triggers: 3,
      status: "active"
    },
    {
      name: "Payment Processing",
      integrations: ["Stripe", "SendGrid", "Slack"],
      triggers: 2,
      status: "configured"
    },
    {
      name: "User Onboarding",
      integrations: ["SendGrid", "Google Analytics"],
      triggers: 1,
      status: "active"
    }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "available":
        return <Plus className="h-4 w-4 text-gray-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "default";
      case "available": return "outline";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Easy": return "default";
      case "Medium": return "secondary";
      case "Hard": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            🔗 Integrations Hub
          </h1>
          <p className="text-lg text-muted-foreground">Connect your favorite tools and services seamlessly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Connected", value: "5", change: "+2", icon: CheckCircle },
            { title: "Available", value: "3", change: "0", icon: Plus },
            { title: "Active Workflows", value: "8", change: "+1", icon: Zap },
            { title: "API Calls/day", value: "24.5K", change: "+12%", icon: Link }
          ].map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <metric.icon className="h-8 w-8 text-cyan-600" />
                  <Badge variant="secondary">{metric.change}</Badge>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Integrations</TabsTrigger>
            <TabsTrigger value="connected">Connected Services</TabsTrigger>
            <TabsTrigger value="workflows">Integration Workflows</TabsTrigger>
            <TabsTrigger value="api">API Management</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      {getStatusIcon(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{integration.category}</Badge>
                        <Badge variant={getComplexityColor(integration.setupComplexity)}>
                          {integration.setupComplexity}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Features:</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {integration.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>

                      {integration.status === "connected" && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Monthly usage: {integration.monthlyUsage}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {integration.status === "connected" ? (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Settings className="h-3 w-3 mr-1" />
                              Configure
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Shield className="h-3 w-3 mr-1" />
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" className="w-full">
                            <Plus className="h-3 w-3 mr-1" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connected">
            <div className="space-y-6">
              {integrations.filter(i => i.status === "connected").map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <CardTitle>{integration.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="default">Connected</Badge>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Status</h4>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Active & Healthy</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Monthly Usage</h4>
                        <p className="text-sm text-muted-foreground">{integration.monthlyUsage}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Last Sync</h4>
                        <p className="text-sm text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm">
                        View Logs
                      </Button>
                      <Button variant="outline" size="sm">
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workflows">
            <div className="space-y-6">
              {workflows.map((workflow, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        {workflow.name}
                      </CardTitle>
                      <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                        {workflow.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Connected Integrations:</h4>
                        <div className="flex gap-2">
                          {workflow.integrations.map((intName) => {
                            const integration = integrations.find(i => i.name === intName);
                            return (
                              <div key={intName} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                                <span className="text-sm">{integration?.icon}</span>
                                <span className="text-sm font-medium">{intName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {workflow.triggers} triggers configured
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "REST API", calls: "18.2K", status: "Healthy", latency: "120ms" },
                    { name: "GraphQL API", calls: "6.3K", status: "Healthy", latency: "85ms" },
                    { name: "Webhook Endpoints", calls: "2.1K", status: "Warning", latency: "340ms" }
                  ].map((api) => (
                    <div key={api.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{api.name}</h4>
                        <Badge variant={api.status === "Healthy" ? "default" : "secondary"}>
                          {api.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Daily calls:</span>
                          <span>{api.calls}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg latency:</span>
                          <span>{api.latency}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        View Documentation
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}