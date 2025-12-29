import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Settings, Code } from "lucide-react";
import type { Template } from "@shared/schema";

interface TemplateGridProps {
  templates: Template[];
}

const templateTypeInfo = {
  header: { name: "Header/Navigation", icon: "🧭", description: "Global navigation system" },
  footer: { name: "Footer/Legal", icon: "⚖️", description: "Privacy, terms, i18n support" },
  checkout: { name: "Checkout/Payment", icon: "💳", description: "VaultMesh™ Banimal Loop" },
  payment: { name: "Payment Hub", icon: "🏦", description: "Multi-brand payment gateway" },
  dashboard: { name: "Sector Index/Dashboard", icon: "📊", description: "Analytics and monitoring" },
  interactive: { name: "Interactive Features", icon: "🎵", description: "Multimedia and engagement" },
};

export default function TemplateGrid({ templates }: TemplateGridProps) {
  const getTemplateTypeInfo = (type: string) => {
    return templateTypeInfo[type as keyof typeof templateTypeInfo] || {
      name: type,
      icon: "📄",
      description: "Custom template"
    };
  };

  return (
    <div className="template-grid">
      {templates.map((template) => {
        const typeInfo = getTemplateTypeInfo(template.type);
        
        return (
          <Card key={template.id} className="dashboard-widget">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{typeInfo.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">v{template.version}</p>
                  </div>
                </div>
                <Badge variant={template.isActive ? "default" : "secondary"}>
                  {template.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {typeInfo.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Template Type</span>
                  <Badge variant="outline">{typeInfo.name}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Last Updated</span>
                  <span className="text-muted-foreground">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Content Size</span>
                  <span className="text-muted-foreground">
                    {JSON.stringify(template.content).length} bytes
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground mt-3">
                Template ID: {template.id.slice(0, 8)}...
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
