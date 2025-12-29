import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Bot, Wand2, Cpu, Brain, Zap, Code, Image, FileText, Settings } from "lucide-react";

export default function AIStudio() {
  const [activeModel, setActiveModel] = useState("gpt-4");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const aiModels = [
    { id: "gpt-4", name: "GPT-4", type: "Language", accuracy: 95, speed: 85 },
    { id: "claude-3", name: "Claude-3", type: "Analysis", accuracy: 92, speed: 90 },
    { id: "gemini-pro", name: "Gemini Pro", type: "Multimodal", accuracy: 88, speed: 95 },
    { id: "dall-e-3", name: "DALL-E 3", type: "Image", accuracy: 90, speed: 80 }
  ];

  const generateContent = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(`Generated content using ${activeModel}:\n\n${prompt}\n\nResult: High-quality ${activeModel} output with advanced capabilities.`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🤖 AI Studio
          </h1>
          <p className="text-lg text-muted-foreground">Advanced AI-powered content generation and automation</p>
        </div>

        <Tabs defaultValue="generation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generation">Content Generation</TabsTrigger>
            <TabsTrigger value="automation">AI Automation</TabsTrigger>
            <TabsTrigger value="training">Model Training</TabsTrigger>
            <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="generation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    AI Content Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select AI Model</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {aiModels.map((model) => (
                        <Button
                          key={model.id}
                          variant={activeModel === model.id ? "default" : "outline"}
                          onClick={() => setActiveModel(model.id)}
                          className="justify-start"
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          {model.name}
                          <Badge variant="secondary" className="ml-auto">
                            {model.type}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Prompt</label>
                    <Textarea
                      placeholder="Enter your AI prompt here..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={generateContent} 
                    disabled={isGenerating || !prompt}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Cpu className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>

                  {generatedContent && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Generated Content:</h4>
                      <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiModels.map((model) => (
                    <div key={model.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{model.name}</span>
                        <Badge variant="outline">{model.type}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Accuracy</span>
                          <span>{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span>Speed</span>
                          <span>{model.speed}%</span>
                        </div>
                        <Progress value={model.speed} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Auto Template Generation", icon: FileText, status: "Active", tasks: 24 },
                { title: "Smart Content Updates", icon: Bot, status: "Active", tasks: 12 },
                { title: "Brand Voice Optimization", icon: Wand2, status: "Running", tasks: 8 },
                { title: "Performance Auto-Tuning", icon: Zap, status: "Scheduled", tasks: 5 },
                { title: "SEO Content Enhancement", icon: Code, status: "Active", tasks: 18 },
                { title: "Image Generation Pipeline", icon: Image, status: "Running", tasks: 7 }
              ].map((automation) => (
                <Card key={automation.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <automation.icon className="h-5 w-5" />
                      {automation.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant={automation.status === "Active" ? "default" : "secondary"}>
                        {automation.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{automation.tasks} tasks</span>
                    </div>
                    <Button variant="outline" className="w-full">Configure</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Custom Model Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Train custom AI models on your brand data for enhanced performance.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Brain className="h-6 w-6 mb-2" />
                    Brand Voice Model
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Code className="h-6 w-6 mb-2" />
                    Template Optimizer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "AI Usage", value: "2.4M", change: "+12%", icon: Bot },
                { title: "Content Generated", value: "15.2K", change: "+24%", icon: FileText },
                { title: "Time Saved", value: "340h", change: "+18%", icon: Zap },
                { title: "Quality Score", value: "94%", change: "+3%", icon: Brain }
              ].map((metric) => (
                <Card key={metric.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <metric.icon className="h-8 w-8 text-purple-600" />
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}