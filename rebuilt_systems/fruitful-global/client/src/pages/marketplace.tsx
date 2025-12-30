import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Star, Download, ShoppingCart, Filter, Search, Package, Zap, Crown, Users, Code2, CheckCircle } from "lucide-react";
import PayPalButton from "@/components/PayPalButton";
import LiveCodeEditor from "@/components/LiveCodeEditor";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentDialog, setPaymentDialog] = useState<{open: boolean; item: any | null}>({open: false, item: null});
  const [installDialog, setInstallDialog] = useState<{open: boolean; item: any | null}>({open: false, item: null});

  const marketplaceItems = [
    {
      id: 1,
      name: "Premium Analytics Dashboard",
      category: "templates",
      price: "$49",
      rating: 4.8,
      downloads: 1200,
      author: "Seedwave™ Team",
      description: "Advanced analytics with real-time insights and custom KPIs",
      isPremium: true,
      tags: ["Analytics", "Dashboard", "Real-time"]
    },
    {
      id: 2,
      name: "E-commerce Checkout Flow",
      category: "templates",
      price: "$79",
      rating: 4.9,
      downloads: 850,
      author: "VaultMesh™ Team",
      description: "Complete checkout system with payment gateway integration",
      isPremium: true,
      tags: ["E-commerce", "Payment", "Conversion"]
    },
    {
      id: 3,
      name: "AI Content Generator Plugin",
      category: "plugins",
      price: "$29",
      rating: 4.7,
      downloads: 2100,
      author: "Fruitful Global™",
      description: "Generate high-quality content using advanced AI models",
      isPremium: false,
      tags: ["AI", "Content", "Automation"]
    },
    {
      id: 4,
      name: "Multi-Brand Theme System",
      category: "themes",
      price: "$39",
      rating: 4.6,
      downloads: 950,
      author: "Banimal™ Team",
      description: "Unified theming system supporting multiple brand identities",
      isPremium: true,
      tags: ["Theming", "Branding", "Customization"]
    },
    {
      id: 5,
      name: "Advanced Form Builder",
      category: "components",
      price: "Free",
      rating: 4.5,
      downloads: 3200,
      author: "Community",
      description: "Drag-and-drop form builder with validation and styling",
      isPremium: false,
      tags: ["Forms", "Builder", "Validation"]
    },
    {
      id: 6,
      name: "Real-time Collaboration Kit",
      category: "integrations",
      price: "$59",
      rating: 4.8,
      downloads: 680,
      author: "Seedwave™ Team",
      description: "Enable real-time collaboration features across your platform",
      isPremium: true,
      tags: ["Collaboration", "Real-time", "Team"]
    }
  ];

  const categories = [
    { id: "all", name: "All Items", icon: Package, count: marketplaceItems.length },
    { id: "templates", name: "Templates", icon: Zap, count: 2 },
    { id: "plugins", name: "Plugins", icon: Package, count: 1 },
    { id: "themes", name: "Themes", icon: Crown, count: 1 },
    { id: "components", name: "Components", icon: Package, count: 1 },
    { id: "integrations", name: "Integrations", icon: Package, count: 1 }
  ];

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            🛒 Marketplace
          </h1>
          <p className="text-lg text-muted-foreground">Discover and install premium templates, plugins, and integrations</p>
        </div>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="marketplace">Browse Marketplace</TabsTrigger>
            <TabsTrigger value="playground">Live Code Playground</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates, plugins, themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          {item.isPremium && (
                            <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <p className="text-xs text-muted-foreground">by {item.author}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{item.downloads.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{item.price}</span>
                        <Button
                          className="flex items-center gap-2"
                          onClick={() => {
                            if (item.price === "Free") {
                              setInstallDialog({open: true, item});
                            } else {
                              setPaymentDialog({open: true, item});
                            }
                          }}
                        >
                          {item.price === "Free" ? (
                            <>
                              <Download className="h-4 w-4" />
                              Install
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              Purchase
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No items found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or browse different categories.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
          </TabsContent>

          <TabsContent value="playground" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Real-time Code Playground</h2>
              <p className="text-muted-foreground">Test and experiment with code in real-time. All changes are synced automatically.</p>
            </div>
            <LiveCodeEditor
              initialCode={`// Welcome to OmniGrid Live Code Playground!
// Write JavaScript code and click "Run Code" to see results

// Example: Simple calculator
function calculate(a, b) {
  return {
    sum: a + b,
    difference: a - b,
    product: a * b,
    quotient: a / b
  };
}

const result = calculate(10, 5);
console.log('Results:', result);

// Try your own code below:
console.log('Hello from OmniGrid Marketplace!');`}
              language="javascript"
              theme="dark"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Real-time execution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Auto-save enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Live collaboration</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-muted-foreground">
                    See live cursors and edits from other developers working on the same code.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <Button size="sm" variant="outline" className="w-full">Share Code</Button>
                  <Button size="sm" variant="outline" className="w-full">Download</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment Dialog with Real PayPal Integration */}
        <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog({open, item: paymentDialog.item})}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Purchase</DialogTitle>
              <DialogDescription>
                You are purchasing: {paymentDialog.item?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{paymentDialog.item?.name}</span>
                  <span className="font-bold">{paymentDialog.item?.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{paymentDialog.item?.description}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Payment Method</h4>
                {paymentDialog.item && (
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
                    <PayPalButton
                      amount={paymentDialog.item.price.replace('$', '')}
                      currency="USD"
                      intent="CAPTURE"
                    />
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                <p>✓ Secure payment powered by PayPal</p>
                <p>✓ Instant access after purchase</p>
                <p>✓ 30-day money-back guarantee</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Install Dialog with Code Preview */}
        <Dialog open={installDialog.open} onOpenChange={(open) => setInstallDialog({open, item: installDialog.item})}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Install {installDialog.item?.name}</DialogTitle>
              <DialogDescription>
                Follow the steps below to install and use this component
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Free Installation</span>
                </div>
                <p className="text-sm text-muted-foreground">This component is free and ready to use</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Installation Code
                </h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="whitespace-pre">
{`# Install via npm
npm install @fruitful/${installDialog.item?.name?.toLowerCase().replace(/\\s+/g, '-')}

# Or via yarn
yarn add @fruitful/${installDialog.item?.name?.toLowerCase().replace(/\\s+/g, '-')}`}
                  </div>
                </div>

                <h4 className="font-medium mt-4 flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Usage Example
                </h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="whitespace-pre">
{`import { ${installDialog.item?.name?.replace(/\\s+/g, '')} } from '@fruitful/components';

function App() {
  return (
    <${installDialog.item?.name?.replace(/\\s+/g, '')}
      theme="modern"
      responsive={true}
    />
  );
}`}
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => setInstallDialog({open: false, item: null})}>
                <Download className="h-4 w-4 mr-2" />
                Close & Start Using
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}