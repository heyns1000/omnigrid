import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RotateCcw, Play, Pause, Plus, Settings, GitBranch, Zap, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function Workflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const workflows = [
    {
      id: 1,
      name: "Multi-Brand Template Sync",
      description: "Synchronize templates across all brand instances",
      status: "active",
      runs: 247,
      successRate: 98.4,
      lastRun: "5 min ago",
      duration: "2.3s",
      triggers: ["Template Update", "Manual", "Scheduled"],
      steps: [
        { name: "Validate Template", status: "completed", duration: "0.5s" },
        { name: "Brand Compatibility Check", status: "completed", duration: "0.8s" },
        { name: "Deploy to Staging", status: "completed", duration: "1.2s" },
        { name: "Run Tests", status: "running", duration: "0.3s" },
        { name: "Deploy to Production", status: "pending", duration: "-" }
      ]
    },
    {
      id: 2,
      name: "Analytics Data Pipeline",
      description: "Process and aggregate analytics data from all sources",
      status: "completed",
      runs: 156,
      successRate: 99.1,
      lastRun: "1 hour ago",
      duration: "45s",
      triggers: ["Scheduled", "Data Update"],
      steps: [
        { name: "Collect Data", status: "completed", duration: "12s" },
        { name: "Clean & Transform", status: "completed", duration: "18s" },
        { name: "Generate Insights", status: "completed", duration: "10s" },
        { name: "Update Dashboard", status: "completed", duration: "5s" }
      ]
    },
    {
      id: 3,
      name: "Security Compliance Audit",
      description: "Automated security checks and compliance validation",
      status: "scheduled",
      runs: 89,
      successRate: 100,
      lastRun: "6 hours ago",
      duration: "8.2s",
      triggers: ["Scheduled", "Security Alert"],
      steps: [
        { name: "Vulnerability Scan", status: "pending", duration: "-" },
        { name: "Access Control Check", status: "pending", duration: "-" },
        { name: "Data Encryption Verify", status: "pending", duration: "-" },
        { name: "Generate Report", status: "pending", duration: "-" }
      ]
    }
  ];

  const workflowTemplates = [
    { name: "CI/CD Pipeline", category: "DevOps", complexity: "Medium", time: "10 min" },
    { name: "Data Backup", category: "Maintenance", complexity: "Low", time: "5 min" },
    { name: "User Onboarding", category: "Business", complexity: "High", time: "20 min" },
    { name: "Content Moderation", category: "AI/ML", complexity: "Medium", time: "15 min" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4 text-green-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Pause className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "running":
        return <RotateCcw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🔄 Workflow Engine
          </h1>
          <p className="text-lg text-muted-foreground">Design, automate, and monitor complex business processes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Active Workflows", value: "12", change: "+2", icon: GitBranch },
            { title: "Total Executions", value: "1,247", change: "+8%", icon: Play },
            { title: "Success Rate", value: "98.7%", change: "+1.2%", icon: CheckCircle },
            { title: "Avg Duration", value: "2.8s", change: "-0.3s", icon: Zap }
          ].map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <metric.icon className="h-8 w-8 text-indigo-600" />
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

        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList>
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Execution History</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <Card 
                    key={workflow.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedWorkflow === workflow.id ? "ring-2 ring-indigo-500" : ""
                    }`}
                    onClick={() => setSelectedWorkflow(workflow.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(workflow.status)}
                          {workflow.name}
                        </CardTitle>
                        <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                          {workflow.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Runs: {workflow.runs}</p>
                          <p className="text-muted-foreground">Success: {workflow.successRate}%</p>
                        </div>
                        <div>
                          <p className="font-medium">Last: {workflow.lastRun}</p>
                          <p className="text-muted-foreground">Duration: {workflow.duration}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Workflow Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedWorkflow ? (
                    <div className="space-y-4">
                      {workflows.find(w => w.id === selectedWorkflow)?.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          {getStepStatusIcon(step.status)}
                          <div className="flex-1">
                            <p className="font-medium">{step.name}</p>
                            <p className="text-sm text-muted-foreground">Duration: {step.duration}</p>
                          </div>
                          <Badge variant={step.status === "completed" ? "default" : "outline"}>
                            {step.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Select a workflow to view details
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="builder">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Visual Workflow Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Design Your Workflow</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop components to create custom automation workflows
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Building
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                  <div className="space-y-2">
                    <h4 className="font-medium">Triggers</h4>
                    {["Schedule", "Webhook", "File Upload", "API Call"].map((trigger) => (
                      <div key={trigger} className="p-2 border rounded cursor-move hover:bg-gray-50">
                        {trigger}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Actions</h4>
                    {["Send Email", "Update Database", "Generate Report", "Deploy Code"].map((action) => (
                      <div key={action} className="p-2 border rounded cursor-move hover:bg-gray-50">
                        {action}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Conditions</h4>
                    {["If/Else", "Switch", "Loop", "Wait"].map((condition) => (
                      <div key={condition} className="p-2 border rounded cursor-move hover:bg-gray-50">
                        {condition}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Integrations</h4>
                    {["Slack", "GitHub", "AWS", "Google"].map((integration) => (
                      <div key={integration} className="p-2 border rounded cursor-move hover:bg-gray-50">
                        {integration}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workflowTemplates.map((template) => (
                    <div key={template.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-semibold mb-2">{template.name}</h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Category:</span>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Complexity:</span>
                          <Badge variant={template.complexity === "High" ? "destructive" : "secondary"}>
                            {template.complexity}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Setup time:</span>
                          <span className="text-muted-foreground">{template.time}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Execution History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { workflow: "Multi-Brand Template Sync", status: "completed", time: "5 min ago", duration: "2.3s" },
                    { workflow: "Analytics Data Pipeline", status: "completed", time: "1 hour ago", duration: "45s" },
                    { workflow: "Security Compliance Audit", status: "completed", time: "6 hours ago", duration: "8.2s" },
                    { workflow: "Multi-Brand Template Sync", status: "completed", time: "6 hours ago", duration: "2.1s" },
                    { workflow: "Analytics Data Pipeline", status: "failed", time: "12 hours ago", duration: "N/A" }
                  ].map((execution, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(execution.status)}
                        <div>
                          <p className="font-medium">{execution.workflow}</p>
                          <p className="text-sm text-muted-foreground">{execution.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{execution.duration}</span>
                        <Badge variant={execution.status === "completed" ? "default" : "destructive"}>
                          {execution.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Logs
                        </Button>
                      </div>
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