import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, Shield, FileText, Users, Lock, Eye, Download } from "lucide-react";

export default function Compliance() {
  const [selectedFramework, setSelectedFramework] = useState("gdpr");

  const complianceFrameworks = [
    {
      id: "gdpr",
      name: "GDPR",
      fullName: "General Data Protection Regulation",
      region: "European Union",
      status: "compliant",
      compliance: 94,
      lastAudit: "2024-01-15",
      requirements: 47,
      completed: 44
    },
    {
      id: "ccpa",
      name: "CCPA",
      fullName: "California Consumer Privacy Act",
      region: "California, USA",
      status: "compliant",
      compliance: 88,
      lastAudit: "2024-01-10",
      requirements: 32,
      completed: 28
    },
    {
      id: "sox",
      name: "SOX",
      fullName: "Sarbanes-Oxley Act",
      region: "United States",
      status: "partial",
      compliance: 72,
      lastAudit: "2023-12-20",
      requirements: 25,
      completed: 18
    },
    {
      id: "iso27001",
      name: "ISO 27001",
      fullName: "Information Security Management",
      region: "International",
      status: "compliant",
      compliance: 91,
      lastAudit: "2024-01-05",
      requirements: 114,
      completed: 104
    }
  ];

  const securityMetrics = [
    { name: "Data Encryption", status: "compliant", score: 100, description: "All data encrypted at rest and in transit" },
    { name: "Access Controls", status: "compliant", score: 95, description: "Multi-factor authentication enabled" },
    { name: "Audit Logging", status: "compliant", score: 98, description: "Comprehensive audit trail maintained" },
    { name: "Data Retention", status: "warning", score: 85, description: "Some legacy data exceeds retention policy" },
    { name: "Privacy Controls", status: "compliant", score: 92, description: "User consent and data subject rights implemented" },
    { name: "Incident Response", status: "compliant", score: 88, description: "Response plan tested and documented" }
  ];

  const auditHistory = [
    {
      date: "2024-01-15",
      type: "GDPR Compliance Review",
      auditor: "External Compliance Corp",
      status: "passed",
      findings: 3,
      resolved: 2
    },
    {
      date: "2024-01-10",
      type: "CCPA Assessment",
      auditor: "Internal Security Team",
      status: "passed",
      findings: 5,
      resolved: 4
    },
    {
      date: "2024-01-05",
      type: "ISO 27001 Audit",
      auditor: "Security Solutions Inc",
      status: "passed",
      findings: 7,
      resolved: 6
    },
    {
      date: "2023-12-20",
      type: "SOX Controls Testing",
      auditor: "Financial Audit Group",
      status: "conditional",
      findings: 12,
      resolved: 8
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "partial":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "passed":
        return "default";
      case "partial":
      case "warning":
      case "conditional":
        return "secondary";
      default:
        return "destructive";
    }
  };

  const selectedFrameworkData = complianceFrameworks.find(f => f.id === selectedFramework);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ✅ Compliance Center
          </h1>
          <p className="text-lg text-muted-foreground">Monitor and manage regulatory compliance across all frameworks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Compliance Score", value: "89%", change: "+3%", icon: Shield },
            { title: "Active Frameworks", value: "4", change: "+1", icon: FileText },
            { title: "Recent Audits", value: "4", change: "0", icon: Eye },
            { title: "Open Findings", value: "8", change: "-2", icon: AlertTriangle }
          ].map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <metric.icon className="h-8 w-8 text-emerald-600" />
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Compliance Overview</TabsTrigger>
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="audits">Audit History</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status by Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceFrameworks.map((framework) => (
                      <div key={framework.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(framework.status)}
                            <span className="font-medium">{framework.name}</span>
                            <Badge variant="outline">{framework.region}</Badge>
                          </div>
                          <span className="text-sm font-medium">{framework.compliance}%</span>
                        </div>
                        <Progress value={framework.compliance} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{framework.completed}/{framework.requirements} requirements</span>
                          <span>Last audit: {framework.lastAudit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityMetrics.map((metric) => (
                      <div key={metric.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(metric.status)}
                          <div>
                            <p className="font-medium">{metric.name}</p>
                            <p className="text-sm text-muted-foreground">{metric.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{metric.score}%</div>
                          <Badge variant={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frameworks">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Frameworks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {complianceFrameworks.map((framework) => (
                      <Button
                        key={framework.id}
                        variant={selectedFramework === framework.id ? "default" : "ghost"}
                        onClick={() => setSelectedFramework(framework.id)}
                        className="w-full justify-start"
                      >
                        <div className="flex items-center gap-3 w-full">
                          {getStatusIcon(framework.status)}
                          <div className="text-left">
                            <p className="font-medium">{framework.name}</p>
                            <p className="text-xs text-muted-foreground">{framework.compliance}% compliant</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {selectedFrameworkData?.fullName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedFrameworkData && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Compliance Score</h4>
                          <div className="flex items-center gap-2">
                            <Progress value={selectedFrameworkData.compliance} className="flex-1" />
                            <span className="text-lg font-bold">{selectedFrameworkData.compliance}%</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Status</h4>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(selectedFrameworkData.status)}
                            <Badge variant={getStatusColor(selectedFrameworkData.status)}>
                              {selectedFrameworkData.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{selectedFrameworkData.completed}</div>
                          <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedFrameworkData.requirements - selectedFrameworkData.completed}
                          </div>
                          <div className="text-sm text-muted-foreground">Pending</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold">{selectedFrameworkData.requirements}</div>
                          <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Documentation
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audits">
            <Card>
              <CardHeader>
                <CardTitle>Audit History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditHistory.map((audit, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(audit.status)}
                        <div>
                          <h4 className="font-medium">{audit.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            Conducted by {audit.auditor} on {audit.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{audit.findings}</div>
                          <div className="text-xs text-muted-foreground">Findings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{audit.resolved}</div>
                          <div className="text-xs text-muted-foreground">Resolved</div>
                        </div>
                        <Badge variant={getStatusColor(audit.status)}>
                          {audit.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Privacy Policy", updated: "2024-01-15", version: "v2.3", status: "current" },
                { name: "Data Retention Policy", updated: "2024-01-10", version: "v1.8", status: "current" },
                { name: "Security Procedures", updated: "2024-01-05", version: "v3.1", status: "current" },
                { name: "Incident Response Plan", updated: "2023-12-20", version: "v2.0", status: "review" },
                { name: "Access Control Policy", updated: "2023-12-15", version: "v1.5", status: "current" },
                { name: "Vendor Management", updated: "2023-12-01", version: "v1.2", status: "outdated" }
              ].map((policy) => (
                <Card key={policy.name}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {policy.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Version:</span>
                        <span className="text-sm font-medium">{policy.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Updated:</span>
                        <span className="text-sm">{policy.updated}</span>
                      </div>
                      <Badge variant={getStatusColor(policy.status)} className="w-full justify-center">
                        {policy.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}