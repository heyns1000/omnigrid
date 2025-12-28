import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Clock, CheckCircle, Settings, Play, Pause, RotateCcw, Calendar, Target } from "lucide-react";

export default function Automation() {
  const [automations, setAutomations] = useState([
    { id: 1, name: "Auto-Deploy Templates", enabled: true, runs: 245, success: 98.2, schedule: "Every 6 hours" },
    { id: 2, name: "Brand Sync Validator", enabled: true, runs: 189, success: 99.1, schedule: "Daily at 2 AM" },
    { id: 3, name: "Performance Monitor", enabled: false, runs: 67, success: 94.8, schedule: "Every 15 minutes" },
    { id: 4, name: "Content Optimizer", enabled: true, runs: 312, success: 96.5, schedule: "Weekly" },
    { id: 5, name: "Security Scan", enabled: true, runs: 89, success: 100, schedule: "Daily at 12 AM" }
  ]);

  const workflows = [
    {
      id: 1,
      name: "Multi-Brand Deployment Pipeline",
      status: "running",
      progress: 75,
      steps: 8,
      completedSteps: 6,
      eta: "5 minutes",
      trigger: "Template Update"
    },
    {
      id: 2,
      name: "Analytics Data Aggregation",
      status: "completed",
      progress: 100,
      steps: 5,
      completedSteps: 5,
      eta: "Completed",
      trigger: "Scheduled"
    },
    {
      id: 3,
      name: "Brand Consistency Check",
      status: "queued",
      progress: 0,
      steps: 12,
      completedSteps: 0,
      eta: "Pending",
      trigger: "Manual"
    }
  ];

  const toggleAutomation = (id: number) => {
    setAutomations(prev => 
      prev.map(auto => 
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-blue-600";
      case "completed": return "text-green-600";
      case "queued": return "text-yellow-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Play className="h-4 w-4 text-blue-600" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "queued": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed": return <RotateCcw className="h-4 w-4 text-red-600" />;
      default: return <Pause className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            ⚡ Automation Center
          </h1>
          <p className="text-lg text-muted-foreground">Streamline operations with intelligent automation workflows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Active Automations", value: "12", change: "+3", icon: Zap },
            { title: "Tasks Completed", value: "2,847", change: "+24%", icon: CheckCircle },
            { title: "Time Saved", value: "127h", change: "+18%", icon: Clock },
            { title: "Success Rate", value: "97.8%", change: "+2.1%", icon: Target }
          ].map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <metric.icon className="h-8 w-8 text-orange-600" />
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

        <Tabs defaultValue="automations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="automations">Automation Rules</TabsTrigger>
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="automations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Automation Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automations.map((automation) => (
                    <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{automation.name}</h3>
                          <Badge variant={automation.enabled ? "default" : "secondary"}>
                            {automation.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <span>Runs: {automation.runs}</span>
                          <span>Success: {automation.success}%</span>
                          <span>Schedule: {automation.schedule}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={automation.enabled}
                          onCheckedChange={() => toggleAutomation(automation.id)}
                        />
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-6">
                  <Zap className="h-4 w-4 mr-2" />
                  Create New Automation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows">
            <div className="space-y-6">
              {workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(workflow.status)}
                        {workflow.name}
                      </CardTitle>
                      <Badge variant="outline" className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress: {workflow.completedSteps}/{workflow.steps} steps</span>
                        <span>ETA: {workflow.eta}</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Triggered by: {workflow.trigger}
                        </span>
                        <div className="flex gap-2">
                          {workflow.status === "running" && (
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          {workflow.status === "queued" && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
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

          <TabsContent value="scheduler">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduled Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { task: "Daily Brand Sync", time: "2:00 AM", frequency: "Daily", nextRun: "Tomorrow 2:00 AM" },
                    { task: "Weekly Analytics Report", time: "Sunday 6:00 AM", frequency: "Weekly", nextRun: "Sunday 6:00 AM" },
                    { task: "Monthly Backup", time: "1st day 12:00 AM", frequency: "Monthly", nextRun: "Next month" },
                    { task: "Security Audit", time: "12:00 AM", frequency: "Daily", nextRun: "Tonight 12:00 AM" }
                  ].map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{schedule.task}</h4>
                        <p className="text-sm text-muted-foreground">
                          {schedule.frequency} at {schedule.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Next run:</p>
                        <p className="text-sm text-muted-foreground">{schedule.nextRun}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Template Deployment", success: 98.5, trend: "+1.2%" },
                      { name: "Data Processing", success: 96.8, trend: "-0.5%" },
                      { name: "Content Sync", success: 99.2, trend: "+2.1%" },
                      { name: "Security Checks", success: 100, trend: "0%" }
                    ].map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{metric.success}%</span>
                            <Badge variant={metric.trend.startsWith('+') ? "default" : "secondary"}>
                              {metric.trend}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={metric.success} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Executions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { task: "Brand Sync", status: "completed", time: "2 min ago", duration: "1.2s" },
                      { task: "Template Deploy", status: "completed", time: "15 min ago", duration: "3.8s" },
                      { task: "Performance Scan", status: "running", time: "Running", duration: "45s" },
                      { task: "Content Update", status: "completed", time: "1 hour ago", duration: "2.1s" },
                      { task: "Security Check", status: "completed", time: "2 hours ago", duration: "5.7s" }
                    ].map((execution, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(execution.status)}
                          <span className="font-medium">{execution.task}</span>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{execution.time}</p>
                          <p>{execution.duration}</p>
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