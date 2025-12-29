import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Play, Upload, Download, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface DeploymentResult {
  success: boolean;
  output: string;
  error?: string;
  generatedFiles: string[];
  deploymentId: string;
}

interface DeploymentStatus {
  exists: boolean;
  files: string[];
}

export default function PythonDeploy() {
  const [pythonCode, setPythonCode] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [deploymentConfig, setDeploymentConfig] = useState({
    sectorName: "",
    brandName: "",
    templateContent: ""
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentResult[]>([]);

  const initializePythonScript = async () => {
    if (!pythonCode.trim()) {
      alert("Please provide Python code");
      return;
    }

    setIsInitializing(true);
    try {
      const response = await fetch("/api/python/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pythonCode })
      });

      if (response.ok) {
        setIsInitialized(true);
        alert("Python deployment script initialized successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to initialize: ${error.error}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const executeDeployment = async () => {
    if (!deploymentConfig.sectorName || !deploymentConfig.brandName) {
      alert("Please provide sector name and brand name");
      return;
    }

    setIsDeploying(true);
    try {
      const response = await fetch("/api/python/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deploymentConfig)
      });

      const result: DeploymentResult = await response.json();
      setDeploymentResult(result);
      setDeploymentHistory(prev => [result, ...prev]);
    } catch (error) {
      alert(`Deployment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const viewGeneratedFile = async (deploymentId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/python/deployment/${deploymentId}/file/${fileName}`);
      if (response.ok) {
        const content = await response.text();
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(content);
          newWindow.document.close();
        }
      } else {
        alert("Failed to load file");
      }
    } catch (error) {
      alert(`Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Play className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Python Deployment Engine</h1>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup Engine</TabsTrigger>
          <TabsTrigger value="deploy">Deploy Templates</TabsTrigger>
          <TabsTrigger value="results">Deployment History</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Initialize Python Deployment Script</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pythonCode">Your Python Deployment Code</Label>
                <Textarea
                  id="pythonCode"
                  placeholder="Paste your Python deployment generator code here..."
                  value={pythonCode}
                  onChange={(e) => setPythonCode(e.target.value)}
                  rows={15}
                  className="font-mono"
                />
              </div>
              
              <Button 
                onClick={initializePythonScript}
                disabled={isInitializing || !pythonCode.trim()}
                className="w-full"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Initialize Python Engine
                  </>
                )}
              </Button>

              {isInitialized && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Python deployment engine is ready! You can now deploy templates.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Execute Deployment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sectorName">Sector Name</Label>
                  <Input
                    id="sectorName"
                    placeholder="e.g., agriculture, banking, creative"
                    value={deploymentConfig.sectorName}
                    onChange={(e) => setDeploymentConfig(prev => ({
                      ...prev,
                      sectorName: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    placeholder="e.g., CropLink, FinGrid, MediaGrid"
                    value={deploymentConfig.brandName}
                    onChange={(e) => setDeploymentConfig(prev => ({
                      ...prev,
                      brandName: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="templateContent">Template Content (Optional)</Label>
                <Textarea
                  id="templateContent"
                  placeholder="Additional template content or configuration..."
                  value={deploymentConfig.templateContent}
                  onChange={(e) => setDeploymentConfig(prev => ({
                    ...prev,
                    templateContent: e.target.value
                  }))}
                  rows={6}
                />
              </div>

              <Button 
                onClick={executeDeployment}
                disabled={isDeploying || !isInitialized || !deploymentConfig.sectorName || !deploymentConfig.brandName}
                className="w-full"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Execute Python Deployment
                  </>
                )}
              </Button>

              {!isInitialized && (
                <Alert>
                  <AlertDescription>
                    Please initialize the Python engine first in the Setup tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {deploymentResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {deploymentResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span>Deployment Result</span>
                  <Badge variant={deploymentResult.success ? "default" : "destructive"}>
                    {deploymentResult.success ? "Success" : "Failed"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Deployment ID</Label>
                  <Input value={deploymentResult.deploymentId} readOnly />
                </div>

                {deploymentResult.output && (
                  <div>
                    <Label>Output</Label>
                    <Textarea value={deploymentResult.output} readOnly rows={6} />
                  </div>
                )}

                {deploymentResult.error && (
                  <div>
                    <Label>Error</Label>
                    <Textarea value={deploymentResult.error} readOnly rows={4} className="border-red-300" />
                  </div>
                )}

                {deploymentResult.generatedFiles.length > 0 && (
                  <div>
                    <Label>Generated Files ({deploymentResult.generatedFiles.length})</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {deploymentResult.generatedFiles.map((file, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => viewGeneratedFile(deploymentResult.deploymentId, file)}
                          className="justify-start"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {file}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Deployment History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deploymentHistory.length === 0 ? (
                <p className="text-muted-foreground">No deployments yet.</p>
              ) : (
                <div className="space-y-4">
                  {deploymentHistory.map((deployment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {deployment.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{deployment.deploymentId}</span>
                          <Badge variant={deployment.success ? "default" : "destructive"} size="sm">
                            {deployment.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          {deployment.generatedFiles.length} files
                        </Badge>
                      </div>
                      
                      {deployment.generatedFiles.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {deployment.generatedFiles.slice(0, 6).map((file, fileIndex) => (
                            <Button
                              key={fileIndex}
                              variant="ghost"
                              size="sm"
                              onClick={() => viewGeneratedFile(deployment.deploymentId, file)}
                              className="justify-start text-xs"
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              {file}
                            </Button>
                          ))}
                          {deployment.generatedFiles.length > 6 && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              +{deployment.generatedFiles.length - 6} more files
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}