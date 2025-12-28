import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Layout, Plus, Eye, Settings, Code } from "lucide-react";
import type { Template, InsertTemplate } from "@shared/schema";

const templateTypes = [
  { id: "all", name: "All Templates", icon: "📋", description: "View all available templates" },
  { id: "header_navigation", name: "Header/Navigation", icon: "🧭", description: "Global navigation system" },
  { id: "footer_legal", name: "Footer/Legal", icon: "⚖️", description: "Privacy, terms, i18n support" },
  { id: "checkout_payment", name: "Checkout/Payment", icon: "💳", description: "VaultMesh™ payment system" },
  { id: "payment_hub", name: "Payment Hub", icon: "🏦", description: "Multi-brand payment gateway" },
  { id: "sector_index_dashboard", name: "Sector Index/Dashboard", icon: "📊", description: "Analytics and monitoring" },
  { id: "interactive_features", name: "Interactive Features", icon: "🎯", description: "Banimal™ engagement tools" },
];

export default function TemplateOrchestration() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  // Filter templates based on selected type
  const filteredTemplates = selectedType === "all" 
    ? templates 
    : templates.filter(template => template.type === selectedType);

  // Get template count by type
  const getTemplateCount = (type: string) => {
    if (type === "all") return templates.length;
    return templates.filter(template => template.type === type).length;
  };

  const createTemplateMutation = useMutation({
    mutationFn: async (template: InsertTemplate) => {
      const response = await apiRequest("POST", "/api/templates", template);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    },
  });

  const handleCreateTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const template: InsertTemplate = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string || "",
      content: formData.get("content") as string,
      version: formData.get("version") as string,
      status: "active",
    };
    
    createTemplateMutation.mutate(template);
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const getTemplateTypeInfo = (type: string) => {
    return templateTypes.find(t => t.id === type) || { 
      name: type, 
      icon: "📄", 
      description: "Custom template" 
    };
  };

  if (isLoading) {
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
            <h1 className="text-3xl font-bold gradient-text">Template Orchestration</h1>
            <p className="text-muted-foreground mt-2">
              Advanced multi-brand template management with AI-powered optimization
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[600px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Global Header v2.1" required />
                  </div>
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" name="version" placeholder="e.g., v2.1.4" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">Template Type</Label>
                  <select 
                    id="type" 
                    name="type" 
                    className="w-full px-3 py-2 border border-input rounded-md"
                    required
                  >
                    <option value="">Select template type</option>
                    {templateTypes.filter(type => type.id !== "all").map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" placeholder="Brief description of template purpose" />
                </div>
                <div>
                  <Label htmlFor="content">Template Content</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    placeholder="Template HTML, CSS, or configuration content..."
                    rows={6}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createTemplateMutation.isPending}
                >
                  {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Advanced Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-semibold text-sm mb-1">Advanced template versioning with A/B testing capabilities</h3>
              <Badge variant="outline" className="text-xs mt-2">v2.0 Ready</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-dashed border-green-500/30 hover:border-green-500/60 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-sm mb-1">Real-time collaborative editing of global templates</h3>
              <Badge variant="outline" className="text-xs mt-2 border-green-500">Live</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-sm mb-1">Advanced analytics consolidation across all brand deployments</h3>
              <Badge variant="outline" className="text-xs mt-2 border-blue-500">Analytics+</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold text-sm mb-1">AI-powered content optimization based on sector and brand perfo...</h3>
              <Badge variant="outline" className="text-xs mt-2 border-purple-500">AI-Powered</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-dashed border-orange-500/30 hover:border-orange-500/60 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">👁️</div>
              <h3 className="font-semibold text-sm mb-1">Interactive template preview with live code highlighting</h3>
              <Badge variant="outline" className="text-xs mt-2 border-orange-500">Preview</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-dashed border-teal-500/30 hover:border-teal-500/60 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-semibold text-sm mb-1">One-click template deployment wizard</h3>
              <Badge variant="outline" className="text-xs mt-2 border-teal-500">Deploy</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-dashed border-pink-500/30 hover:border-pink-500/60 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-sm mb-1">Personalized template recommendation engine</h3>
              <Badge variant="outline" className="text-xs mt-2 border-pink-500">Smart</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-dashed border-yellow-500/30 hover:border-yellow-500/60 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎬</div>
              <h3 className="font-semibold text-sm mb-1">Micro-animations for template interactions</h3>
              <Badge variant="outline" className="text-xs mt-2 border-yellow-500">Animated</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Accessibility Feature */}
        <div className="mb-8">
          <Card className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">♿</div>
              <h3 className="font-semibold text-lg mb-2">Integrated accessibility scoring for templates</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Comprehensive WCAG compliance checking with real-time accessibility metrics
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="border-indigo-500">WCAG 2.1</Badge>
                <Badge variant="outline" className="border-indigo-500">Section 508</Badge>
                <Badge variant="outline" className="border-indigo-500">Real-time</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Type Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {templateTypes.map((type) => {
            const count = getTemplateCount(type.id);
            return (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                onClick={() => setSelectedType(type.id)}
                size="sm"
                className="flex items-center gap-2"
              >
                <span>{type.icon}</span>
                {type.name} ({count})
              </Button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Layout className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No {selectedType === "all" ? "" : getTemplateTypeInfo(selectedType).name} templates found
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {selectedType === "all" 
                  ? "Create your first template to get started with the orchestration system."
                  : `Create a ${getTemplateTypeInfo(selectedType).name} template to get started.`
                }
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTemplateTypeInfo(template.type).icon}</span>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                    <Badge variant={template.status === "active" ? "default" : "secondary"}>
                      {template.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Version: {template.version}</span>
                    <span>{getTemplateTypeInfo(template.type).name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Code className="h-4 w-4 mr-2" />
                      Deploy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="flex items-center gap-3">
                <span className="text-2xl">{previewTemplate ? getTemplateTypeInfo(previewTemplate.type).icon : "📄"}</span>
                <div>
                  <div className="text-xl font-bold">{previewTemplate?.name}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {previewTemplate?.description} • Version {previewTemplate?.version}
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden">
              {previewTemplate && (
                <div className="h-[70vh] border rounded-lg mx-6 mb-6 overflow-hidden">
                  <iframe
                    srcDoc={
                      typeof previewTemplate.content === 'object' && previewTemplate.content && 'html' in previewTemplate.content
                        ? previewTemplate.content.html as string
                        : typeof previewTemplate.content === 'string'
                        ? previewTemplate.content
                        : JSON.stringify(previewTemplate.content, null, 2)
                    }
                    className="w-full h-full border-0"
                    title={`Preview: ${previewTemplate.name}`}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}
            </div>
            
            <div className="p-6 pt-0 flex justify-between items-center border-t">
              <div className="flex items-center gap-2">
                <Badge variant={previewTemplate?.status === "active" ? "default" : "secondary"}>
                  {previewTemplate?.status}
                </Badge>
                <Badge variant="outline">
                  {previewTemplate ? getTemplateTypeInfo(previewTemplate.type).name : ""}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Close Preview
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Code className="h-4 w-4 mr-2" />
                  Deploy Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}