import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Zap, Clock, TrendingUp, Activity, Target, Gauge, BarChart3, AlertTriangle } from "lucide-react";

export default function Performance() {
  const [realTimeMetrics, setRealTimeMetrics] = useState([
    { time: "12:00", responseTime: 120, throughput: 2400, errorRate: 0.1, cpuUsage: 45 },
    { time: "12:05", responseTime: 115, throughput: 2600, errorRate: 0.2, cpuUsage: 52 },
    { time: "12:10", responseTime: 130, throughput: 2200, errorRate: 0.1, cpuUsage: 48 },
    { time: "12:15", responseTime: 110, throughput: 2800, errorRate: 0.3, cpuUsage: 42 },
    { time: "12:20", responseTime: 125, throughput: 2500, errorRate: 0.1, cpuUsage: 47 }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => {
        const newData = [...prev.slice(1)];
        const time = new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        newData.push({
          time,
          responseTime: Math.floor(Math.random() * 50) + 100,
          throughput: Math.floor(Math.random() * 1000) + 2000,
          errorRate: Math.random() * 0.5,
          cpuUsage: Math.floor(Math.random() * 30) + 35
        });
        return newData;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const performanceMetrics = [
    { name: "Response Time", value: "125ms", target: "< 200ms", status: "good", trend: "-5ms" },
    { name: "Throughput", value: "2.5K/s", target: "> 2K/s", status: "good", trend: "+12%" },
    { name: "Error Rate", value: "0.15%", target: "< 1%", status: "good", trend: "-0.05%" },
    { name: "Uptime", value: "99.97%", target: "> 99.9%", status: "excellent", trend: "+0.02%" }
  ];

  const pageMetrics = [
    { page: "/dashboard", loadTime: 1.2, fcp: 0.8, lcp: 1.5, cls: 0.05, score: 92 },
    { page: "/templates", loadTime: 0.9, fcp: 0.6, lcp: 1.1, cls: 0.02, score: 96 },
    { page: "/analytics", loadTime: 2.1, fcp: 1.2, lcp: 2.8, cls: 0.12, score: 78 },
    { page: "/brands", loadTime: 1.0, fcp: 0.7, lcp: 1.3, cls: 0.03, score: 94 },
    { page: "/deployment", loadTime: 1.4, fcp: 0.9, lcp: 1.8, cls: 0.07, score: 88 }
  ];

  const apiEndpoints = [
    { endpoint: "GET /api/brands", avgResponse: 85, p95: 120, calls: "12.4K", errors: 0.1 },
    { endpoint: "GET /api/templates", avgResponse: 92, p95: 140, calls: "8.7K", errors: 0.2 },
    { endpoint: "POST /api/deploy", avgResponse: 340, p95: 580, calls: "1.2K", errors: 0.8 },
    { endpoint: "GET /api/analytics", avgResponse: 156, p95: 250, calls: "5.3K", errors: 0.3 },
    { endpoint: "PUT /api/brands/:id", avgResponse: 78, p95: 110, calls: "890", errors: 0.1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "warning": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            ⚡ Performance Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">Monitor and optimize application performance in real-time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Zap className={`h-8 w-8 ${getStatusColor(metric.status)}`} />
                  <Badge variant="secondary">{metric.trend}</Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{metric.name}</p>
                  <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Performance Overview</TabsTrigger>
            <TabsTrigger value="frontend">Frontend Metrics</TabsTrigger>
            <TabsTrigger value="backend">Backend Performance</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Real-time Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={realTimeMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="responseTime" stroke="#8b5cf6" strokeWidth={2} name="Response Time (ms)" />
                      <Line type="monotone" dataKey="errorRate" stroke="#ef4444" strokeWidth={2} name="Error Rate %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Throughput & Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={realTimeMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="throughput" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Throughput" />
                      <Area type="monotone" dataKey="cpuUsage" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="CPU Usage %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { severity: "warning", message: "Analytics page showing increased load times", time: "5 min ago", metric: "Page Load Time" },
                    { severity: "info", message: "API deployment endpoint optimized successfully", time: "1 hour ago", metric: "API Response" },
                    { severity: "warning", message: "CPU usage spike detected during peak hours", time: "2 hours ago", metric: "Resource Usage" }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <AlertTriangle className={`h-5 w-5 mt-1 ${
                        alert.severity === "warning" ? "text-yellow-600" : "text-blue-600"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{alert.message}</p>
                          <Badge variant={alert.severity === "warning" ? "secondary" : "outline"}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.metric} • {alert.time}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frontend">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Page Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pageMetrics.map((page) => (
                    <div key={page.page} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">{page.page}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${getScoreColor(page.score)}`}>
                            {page.score}
                          </span>
                          <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Load Time</p>
                          <p className="font-medium">{page.loadTime}s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">First Contentful Paint</p>
                          <p className="font-medium">{page.fcp}s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Largest Contentful Paint</p>
                          <p className="font-medium">{page.lcp}s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cumulative Layout Shift</p>
                          <p className="font-medium">{page.cls}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Progress value={page.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backend">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  API Endpoint Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((api) => (
                    <div key={api.endpoint} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{api.endpoint}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Avg Response</p>
                            <p className="font-medium">{api.avgResponse}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">95th Percentile</p>
                            <p className="font-medium">{api.p95}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Daily Calls</p>
                            <p className="font-medium">{api.calls}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Error Rate</p>
                            <p className={`font-medium ${api.errors > 0.5 ? 'text-red-600' : 'text-green-600'}`}>
                              {api.errors}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Trace
                        </Button>
                        <Button variant="outline" size="sm">
                          Optimize
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        title: "Enable Image Optimization", 
                        impact: "High", 
                        effort: "Low", 
                        savings: "25% faster load times",
                        description: "Implement next-gen image formats and lazy loading"
                      },
                      { 
                        title: "API Response Caching", 
                        impact: "Medium", 
                        effort: "Medium", 
                        savings: "40% reduction in API calls",
                        description: "Cache frequently accessed analytics data"
                      },
                      { 
                        title: "Bundle Size Optimization", 
                        impact: "Medium", 
                        effort: "High", 
                        savings: "30% smaller bundles",
                        description: "Tree shake unused dependencies and code split"
                      }
                    ].map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          <div className="flex gap-1">
                            <Badge variant={rec.impact === "High" ? "destructive" : "secondary"}>
                              {rec.impact}
                            </Badge>
                            <Badge variant="outline">{rec.effort}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <p className="text-sm font-medium text-green-600">{rec.savings}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Target className="h-3 w-3 mr-1" />
                          Implement
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { name: "JavaScript Bundle", size: "2.4 MB", gzipped: "680 KB", change: "-12%" },
                      { name: "CSS Assets", size: "340 KB", gzipped: "89 KB", change: "-5%" },
                      { name: "Images", size: "1.8 MB", gzipped: "1.6 MB", change: "+3%" },
                      { name: "Fonts", size: "156 KB", gzipped: "98 KB", change: "0%" }
                    ].map((resource) => (
                      <div key={resource.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{resource.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{resource.size}</span>
                            <Badge variant={resource.change.startsWith('-') ? "default" : "secondary"}>
                              {resource.change}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Gzipped: {resource.gzipped}</span>
                          <Button variant="outline" size="sm">
                            Analyze
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