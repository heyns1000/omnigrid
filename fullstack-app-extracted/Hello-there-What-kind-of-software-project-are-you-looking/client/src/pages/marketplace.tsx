import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Crown,
  Download,
  Filter,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { marketplaceAdapter, type MarketplaceItem, type MarketplaceListResult } from "@/services/marketplace";

const categoryDefinitions = [
  { id: "all", name: "All Items", icon: Package },
  { id: "templates", name: "Templates", icon: Zap },
  { id: "plugins", name: "Plugins", icon: Package },
  { id: "themes", name: "Themes", icon: Crown },
  { id: "components", name: "Components", icon: Package },
  { id: "integrations", name: "Integrations", icon: Sparkles },
] as const;

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const {
    data: listResult,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<MarketplaceListResult>({
    queryKey: ["marketplace-items"],
    queryFn: () => marketplaceAdapter.getItems(),
    staleTime: 5 * 60 * 1000,
  });

  const marketplaceItems: MarketplaceItem[] = listResult?.items ?? [];

  const filteredItems = useMemo(
    () =>
      marketplaceItems.filter((item) => {
        const search = searchQuery.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.tags.some((tag) => tag.toLowerCase().includes(search));
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [marketplaceItems, searchQuery, selectedCategory],
  );

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedItemId(null);
      return;
    }

    if (selectedItemId === null || !filteredItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(filteredItems[0].id);
    }
  }, [filteredItems, selectedItemId]);

  const { data: selectedItem, isLoading: isDetailLoading } = useQuery({
    queryKey: ["marketplace-item", selectedItemId],
    queryFn: () => marketplaceAdapter.getItem(selectedItemId!),
    enabled: selectedItemId !== null,
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoryDefinitions.map((category) => ({
    ...category,
    count:
      category.id === "all"
        ? marketplaceItems.length
        : marketplaceItems.filter((item) => item.category === category.id).length,
  }));

  const premiumCount = marketplaceItems.filter((item) => item.isPremium).length;
  const totalDownloads = marketplaceItems.reduce((sum, item) => sum + item.downloads, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading marketplace…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <Card className="max-w-md w-full dashboard-widget">
          <CardContent className="py-12 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-lg font-semibold text-destructive">Marketplace unavailable</h3>
            <p className="text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "Unable to load marketplace items."}
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-4xl sm:text-5xl font-black gradient-text">Marketplace</h1>
              {listResult?.source === "fallback" && (
                <Badge variant="outline" className="text-xs bg-background/70">
                  fallback catalog
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore deployable templates, integrations, and premium operating kits inside the Fruitful-aligned OmniGrid runtime.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="dashboard-widget">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Listings live</p>
                <p className="text-3xl font-bold text-primary">{marketplaceItems.length}</p>
              </CardContent>
            </Card>
            <Card className="dashboard-widget">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Premium kits</p>
                <p className="text-3xl font-bold text-primary">{premiumCount}</p>
              </CardContent>
            </Card>
            <Card className="dashboard-widget">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total downloads</p>
                <p className="text-3xl font-bold text-primary">{totalDownloads.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-72 space-y-6">
              <Card className="dashboard-widget">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Browse catalog
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.name}
                      </span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="dashboard-widget">
                <CardHeader>
                  <CardTitle className="text-lg">Listing detail</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isDetailLoading ? (
                    <div className="space-y-3">
                      <div className="h-6 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-full rounded bg-muted animate-pulse" />
                      <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
                    </div>
                  ) : selectedItem ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                            <p className="text-sm text-muted-foreground">by {selectedItem.author}</p>
                          </div>
                          {selectedItem.isPremium && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg border bg-background/60 p-3">
                          <p className="text-muted-foreground">Rating</p>
                          <p className="font-semibold">{selectedItem.rating} / 5</p>
                        </div>
                        <div className="rounded-lg border bg-background/60 p-3">
                          <p className="text-muted-foreground">Downloads</p>
                          <p className="font-semibold">{selectedItem.downloads.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-2xl font-bold">{selectedItem.price}</span>
                        <Button className="flex items-center gap-2">
                          {selectedItem.price === "Free" ? (
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
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Select a listing to inspect package details and install options.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates, plugins, integrations..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-10 bg-background/80"
                />
              </div>

              {filteredItems.length === 0 ? (
                <Card className="dashboard-widget">
                  <CardContent className="py-12 text-center">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No items found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or switch to another category.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    return (
                      <Card
                        key={item.id}
                        className={`dashboard-widget transition-all ${
                          isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg"
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                {item.isPremium && (
                                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <p className="text-xs text-muted-foreground">by {item.author}</p>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {item.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
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

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-2xl font-bold">{item.price}</span>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => setSelectedItemId(item.id)}>
                                View details
                              </Button>
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
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
