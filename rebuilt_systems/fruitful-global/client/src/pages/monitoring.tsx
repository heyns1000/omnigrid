import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Server, Zap, AlertTriangle, CheckCircle, Clock, Cpu, HardDrive, Wifi } from "lucide-react";

export default function Monitoring() {
  const [realTimeData, setRealTimeData] = useState([
    { time: "00:00", cpu: 45, memory: 62, network: 78 },
    { time: "00:05", cpu: 52, memory: 58, network: 82 },
    { time: "00:10", cpu: 48, memory: 65, network: 75 },
    { time: "00:15", cpu: 38, memory: 61, network: 88 },
    { time: "00:20", cpu: 42, memory: 59, network: 79 }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = [...prev.slice(1)];
        const time = new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        newData.push({
          time,
          cpu: Math.floor(Math.random() * 40) + 30,
          memory: Math.floor(Math.random() * 30) + 50,
          network: Math.floor(Math.random() * 40) + 60
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const systemMetrics = [
    { name: "CPU Usage", value: 42, status: "good", icon: Cpu, color: "text-green-600" },
    { name: "Memory", value: 68, status: "warning", icon: HardDrive, color: "text-yellow-600" },
    { name: "Disk Space", value: 84, status: "critical", icon: HardDrive, color: "text-red-600" },
    { name: "Network", value: 35, status: "good", icon: Wifi, color: "text-green-600" }
  ];

  const services = [
    { name: "API Gateway", status: "online", uptime: "99.9%", response: "120ms", requests: "2.4K/min" },
    { name: "Database", status: "online", uptime: "99.8%", response: "45ms", requests: "890/min" },
    { name: "Cache Layer", status: "warning", uptime: "98.5%", response: "15ms", requests: "5.2K/min" },
    { name: "File Storage", status: "online", uptime: "100%", response: "200ms", requests: "340/min" },
    { name: "Analytics Engine", status: "offline", uptime: "0%", response: "N/A", requests: "0/min" }
  ];

  const alerts = [
    { 
      id: 1, 
      severity: "critical", 
      message: "High disk usage on server-prod-01", 
      time: "2 min ago",
      service: "File Storage"
    },
    { 
      id: 2, 
      severity: "warning", 
      message: "Increased response time for API endpoints", 
      time: "15 min ago",
      service: "API Gateway"
    },
    { 
      id: 3, 
      severity: "info", 
      message: "Scheduled maintenance completed successfully", 
      time: "1 hour ago",
      service: "Database"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "default";
      case "warning": return "secondary";
      case "offline": return "destructive";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            📡 System Monitoring
          </h1>
          <p className="text-lg text-muted-foreground">Real-time infrastructure monitoring and alerting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  <Badge variant={metric.status === "critical" ? "destructive" : metric.status === "warning" ? "secondary" : "default"}>
                    {metric.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{metric.value}%</h3>
                  <p className="text-sm text-muted-foreground">{metric.name}</p>
                  <Progress value={metric.value} className="mt-2 h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Real-time System Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={realTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" />
                      <Line type="monotone" dataKey="memory" stroke="#ef4444" strokeWidth={2} name="Memory %" />
                      <Line type="monotone" dataKey="network" stroke="#10b981" strokeWidth={2} name="Network %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Server Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "prod-web-01", status: "healthy", load: 45, uptime: "15d 8h" },
                      { name: "prod-web-02", status: "healthy", load: 52, uptime: "15d 8h" },
                      { name: "prod-db-01", status: "warning", load: 78, uptime: "15d 7h" },
                      { name: "prod-cache-01", status: "healthy", load: 32, uptime: "15d 8h" }
                    ].map((server) => (
                      <div key={server.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            server.status === "healthy" ? "bg-green-500" :
                            server.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                          }`}></div>
                          <div>
                            <p className="font-medium">{server.name}</p>
                            <p className="text-sm text-muted-foreground">Uptime: {server.uptime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{server.load}% load</p>
                          <Badge variant={server.status === "healthy" ? "default" : "secondary"}>
                            {server.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(service.status)}
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Uptime: {service.uptime} • Response: {service.response}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{service.requests}</p>
                          <p className="text-xs text-muted-foreground">requests/min</p>
                        </div>
                        <Badge variant={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <AlertTriangle className={`h-5 w-5 mt-1 ${
                        alert.severity === "critical" ? "text-red-600" :
                        alert.severity === "warning" ? "text-yellow-600" : "text-blue-600"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{alert.message}</p>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.service} • {alert.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Acknowledge
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={realTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="memory" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="network" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { endpoint: "/api/brands", time: "120ms", status: "good" },
                        { endpoint: "/api/templates", time: "85ms", status: "good" },
                        { endpoint: "/api/analytics", time: "340ms", status: "warning" },
                        { endpoint: "/api/deploy", time: "1.2s", status: "slow" }
                      ].map((endpoint) => (
                        <div key={endpoint.endpoint} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{endpoint.endpoint}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{endpoint.time}</span>
                            <div className={`w-2 h-2 rounded-full ${
                              endpoint.status === "good" ? "bg-green-500" :
                              endpoint.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Error Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { service: "API Gateway", rate: "0.1%", trend: "down" },
                        { service: "Database", rate: "0.0%", trend: "stable" },
                        { service: "File Storage", rate: "0.3%", trend: "up" },
                        { service: "Cache", rate: "0.0%", trend: "stable" }
                      ].map((error) => (
                        <div key={error.service} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{error.service}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{error.rate}</span>
                            <div className={`w-0 h-0 border-l-2 border-r-2 border-transparent ${
                              error.trend === "down" ? "border-t-4 border-t-green-500" :
                              error.trend === "up" ? "border-b-4 border-b-red-500" : "border-t-2 border-b-2 border-gray-500"
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Throughput</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { metric: "Requests/sec", value: "1,240", change: "+12%" },
                        { metric: "Data processed", value: "2.4 GB/h", change: "+8%" },
                        { metric: "Cache hits", value: "94.2%", change: "+3%" },
                        { metric: "Active users", value: "342", change: "+15%" }
                      ].map((metric) => (
                        <div key={metric.metric} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{metric.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{metric.value}</span>
                            <Badge variant="secondary">{metric.change}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}