import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Download, ShoppingCart, Filter, Search, Package, Zap, Crown, AlertCircle } from "lucide-react";
import { marketplaceAdapter, type MarketplaceItem, type MarketplaceListResult } from "@/services/marketplace";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: listResult,
    isLoading,
    isError,
    error,
  } = useQuery<MarketplaceListResult>({
    queryKey: ["marketplace-items"],
    queryFn: () => marketplaceAdapter.getItems(),
    staleTime: 5 * 60 * 1000,
  });

  const marketplaceItems: MarketplaceItem[] = listResult?.items ?? [];

  const categories = [
    { id: "all", name: "All Items", icon: Package, count: marketplaceItems.length },
    { id: "templates", name: "Templates", icon: Zap, count: marketplaceItems.filter((i) => i.category === "templates").length },
    { id: "plugins", name: "Plugins", icon: Package, count: marketplaceItems.filter((i) => i.category === "plugins").length },
    { id: "themes", name: "Themes", icon: Crown, count: marketplaceItems.filter((i) => i.category === "themes").length },
    { id: "components", name: "Components", icon: Package, count: marketplaceItems.filter((i) => i.category === "components").length },
    { id: "integrations", name: "Integrations", icon: Package, count: marketplaceItems.filter((i) => i.category === "integrations").length },
  ];

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading marketplace…</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-lg font-semibold text-destructive">Marketplace unavailable</h3>
            <p className="text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "Unable to load marketplace items."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🛒 Marketplace
            </h1>
            {listResult?.source === "fallback" && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                offline data
              </Badge>
            )}
          </div>
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