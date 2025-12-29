import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, MapPin, Clock, Users, TrendingUp, AlertCircle, CheckCircle, Activity } from "lucide-react";

export default function GlobalOps() {
  const [selectedRegion, setSelectedRegion] = useState("global");

  const regions = [
    {
      id: "global",
      name: "Global Overview",
      deployments: 247,
      uptime: 99.97,
      users: "1.2M",
      revenue: "$2.4M"
    },
    {
      id: "na",
      name: "North America",
      deployments: 89,
      uptime: 99.95,
      users: "450K",
      revenue: "$980K",
      locations: ["New York", "San Francisco", "Toronto"]
    },
    {
      id: "eu",
      name: "Europe",
      deployments: 76,
      uptime: 99.98,
      users: "380K",
      revenue: "$720K",
      locations: ["London", "Frankfurt", "Amsterdam"]
    },
    {
      id: "ap",
      name: "Asia Pacific",
      deployments: 82,
      uptime: 99.94,
      users: "370K",
      revenue: "$700K",
      locations: ["Tokyo", "Singapore", "Sydney"]
    }
  ];

  const globalDeployments = [
    {
      region: "North America",
      brands: ["Seedwave™", "VaultMesh™"],
      status: "operational",
      instances: 12,
      traffic: "high",
      lastUpdate: "2 min ago"
    },
    {
      region: "Europe",
      brands: ["Banimal™", "Fruitful Global™"],
      status: "operational",
      instances: 8,
      traffic: "medium",
      lastUpdate: "5 min ago"
    },
    {
      region: "Asia Pacific",
      brands: ["Seedwave™", "Banimal™"],
      status: "maintenance",
      instances: 6,
      traffic: "low",
      lastUpdate: "1 hour ago"
    },
    {
      region: "South America",
      brands: ["VaultMesh™"],
      status: "operational",
      instances: 4,
      traffic: "medium",
      lastUpdate: "15 min ago"
    }
  ];

  const operationalMetrics = [
    { name: "Global Deployments", value: 247, target: 250, status: "on-track" },
    { name: "Active Regions", value: 4, target: 5, status: "expanding" },
    { name: "Total Users", value: 1200000, target: 1500000, status: "growing" },
    { name: "Revenue (Monthly)", value: 2400000, target: 3000000, status: "growing" }
  ];

  const incidentHistory = [
    {
      severity: "critical",
      title: "Database Connection Timeout - EU Region",
      region: "Europe",
      duration: "12 minutes",
      resolved: "2 hours ago",
      impact: "Service degradation for 15% of EU users"
    },
    {
      severity: "warning",
      title: "High API Response Times - APAC",
      region: "Asia Pacific",
      duration: "45 minutes",
      resolved: "6 hours ago",
      impact: "Slower response times for analytics endpoints"
    },
    {
      severity: "info",
      title: "Scheduled Maintenance - NA East",
      region: "North America",
      duration: "2 hours",
      resolved: "1 day ago",
      impact: "No user impact - maintenance window"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "maintenance":
        return <Activity className="h-4 w-4 text-yellow-600" />;
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "outage":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "default";
      case "maintenance": return "secondary";
      case "degraded": return "secondary";
      case "outage": return "destructive";
      default: return "outline";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "warning": return "secondary";
      case "info": return "outline";
      default: return "outline";
    }
  };

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const selectedRegionData = regions.find(r => r.id === selectedRegion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
            🌍 Global Operations Center
          </h1>
          <p className="text-lg text-muted-foreground">Monitor and manage worldwide deployments and operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {operationalMetrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="h-8 w-8 text-slate-600" />
                  <Badge variant={metric.status === "growing" ? "default" : "secondary"}>
                    {metric.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {typeof metric.value === 'number' && metric.value > 1000 
                      ? formatNumber(metric.value) 
                      : metric.value}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{metric.name}</p>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: {formatNumber(metric.target)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Regional Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant={selectedRegion === region.id ? "default" : "ghost"}
                    onClick={() => setSelectedRegion(region.id)}
                    className="w-full justify-start"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {region.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {selectedRegionData?.name} Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRegionData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{selectedRegionData.deployments}</div>
                    <div className="text-sm text-muted-foreground">Deployments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{selectedRegionData.uptime}%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{selectedRegionData.users}</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{selectedRegionData.revenue}</div>
                    <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                  </div>
                </div>
              )}
              
              {selectedRegionData?.locations && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Data Centers</h4>
                  <div className="flex gap-2">
                    {selectedRegionData.locations.map((location) => (
                      <Badge key={location} variant="outline">{location}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deployments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="deployments">Global Deployments</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
            <TabsTrigger value="incidents">Incident History</TabsTrigger>
            <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="deployments">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {globalDeployments.map((deployment) => (
                <Card key={deployment.region}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {deployment.region}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(deployment.status)}
                        <Badge variant={getStatusColor(deployment.status)}>
                          {deployment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Active Brands</h4>
                        <div className="flex gap-1">
                          {deployment.brands.map((brand) => (
                            <Badge key={brand} variant="outline">{brand}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Instances</p>
                          <p className="font-medium">{deployment.instances}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Traffic</p>
                          <p className={`font-medium ${getTrafficColor(deployment.traffic)}`}>
                            {deployment.traffic}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Update</p>
                          <p className="font-medium">{deployment.lastUpdate}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Activity className="h-3 w-3 mr-1" />
                          Monitor
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Scale
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="status">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { service: "API Gateway", regions: 4, status: "operational", uptime: "99.97%" },
                { service: "Database Cluster", regions: 4, status: "operational", uptime: "99.95%" },
                { service: "CDN Network", regions: 8, status: "operational", uptime: "99.99%" },
                { service: "Authentication", regions: 4, status: "operational", uptime: "99.98%" },
                { service: "Analytics Engine", regions: 3, status: "maintenance", uptime: "99.90%" },
                { service: "File Storage", regions: 6, status: "operational", uptime: "100%" }
              ].map((service) => (
                <Card key={service.service}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{service.service}</CardTitle>
                      {getStatusIcon(service.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Regions:</span>
                        <span className="text-sm font-medium">{service.regions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Uptime:</span>
                        <span className="text-sm font-medium">{service.uptime}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidentHistory.map((incident, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <AlertTriangle className={`h-5 w-5 mt-1 ${
                        incident.severity === "critical" ? "text-red-600" :
                        incident.severity === "warning" ? "text-yellow-600" : "text-blue-600"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{incident.title}</h4>
                          <Badge variant={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {incident.region} • Duration: {incident.duration} • Resolved: {incident.resolved}
                        </p>
                        <p className="text-sm">{incident.impact}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="capacity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { resource: "Compute", current: 68, capacity: 100, trend: "+12%" },
                      { resource: "Storage", current: 45, capacity: 100, trend: "+8%" },
                      { resource: "Network", current: 34, capacity: 100, trend: "+5%" },
                      { resource: "Database", current: 72, capacity: 100, trend: "+15%" }
                    ].map((resource) => (
                      <div key={resource.resource} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{resource.resource}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{resource.current}% used</span>
                            <Badge variant="secondary">{resource.trend}</Badge>
                          </div>
                        </div>
                        <Progress value={resource.current} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scaling Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        action: "Scale Database Cluster", 
                        priority: "High", 
                        impact: "Improved query performance",
                        eta: "2 hours"
                      },
                      { 
                        action: "Add EU-West Data Center", 
                        priority: "Medium", 
                        impact: "Reduced latency for European users",
                        eta: "2 weeks"
                      },
                      { 
                        action: "Expand CDN Coverage", 
                        priority: "Low", 
                        impact: "Better global asset delivery",
                        eta: "1 week"
                      }
                    ].map((rec, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{rec.action}</h4>
                          <Badge variant={rec.priority === "High" ? "destructive" : "secondary"}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.impact}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">ETA: {rec.eta}</span>
                          <Button variant="outline" size="sm">
                            Execute
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}