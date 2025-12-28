import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Download, ShoppingCart, Filter, Search, Package, Zap, Crown, Users } from "lucide-react";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

        <div className="mb-6 flex flex-col md:flex-row gap-4">
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
                        <Button className="flex items-center gap-2">
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
      </div>
    </div>
  );
}