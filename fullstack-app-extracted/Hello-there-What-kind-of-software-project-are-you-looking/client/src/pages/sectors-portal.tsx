/**
 * Sectors Portal — adapted from fruitful/frontend/src/pages/Sectors.tsx
 *
 * Uses the existing OmniGrid /api/sectors endpoint and displays sector cards
 * with subscribe actions.  Gracefully degrades with empty/loading states.
 */
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Layers, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sector {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  status: string;
}

export default function SectorsPortal() {
  const { toast } = useToast();

  const { data: sectors = [], isLoading, isError } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  });

  const handleSubscribe = (sector: Sector) => {
    toast({
      title: `Subscribed to ${sector.name}`,
      description: "You will receive updates for this sector.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <section className="py-14 px-6 bg-gradient-to-r from-purple-600 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Layers className="h-8 w-8" />
            <h1 className="text-4xl font-bold">📦 Sectors Portal</h1>
          </div>
          <p className="text-purple-100 text-lg">
            Industry-specific portals and solutions across the FAA.ZONE™ ecosystem
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-lg font-semibold text-destructive">Failed to load sectors</p>
              <p className="text-muted-foreground text-sm">
                The backend may be unavailable. Please try again shortly.
              </p>
            </div>
          )}

          {!isLoading && !isError && sectors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <Globe className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-semibold">No sectors configured yet</p>
              <p className="text-muted-foreground text-sm">
                Sectors will appear here once they are added to the platform.
              </p>
            </div>
          )}

          {!isLoading && !isError && sectors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {sectors.map((sector) => (
                <Card key={sector.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-2">
                    <div className="text-5xl mb-2">{sector.icon ?? "🌐"}</div>
                    <CardTitle className="text-lg">{sector.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {sector.description ?? `Access ${sector.name} sector portal`}
                    </p>
                    <Badge
                      variant={sector.status === "active" ? "default" : "secondary"}
                      className={
                        sector.status === "active"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-300"
                          : ""
                      }
                    >
                      {sector.status === "active" ? "Active" : "Coming Soon"}
                    </Badge>
                    <div className="pt-1">
                      <Button
                        size="sm"
                        variant={sector.status === "active" ? "default" : "ghost"}
                        disabled={sector.status !== "active"}
                        onClick={() => handleSubscribe(sector)}
                        className="w-full"
                      >
                        {sector.status === "active" ? "Subscribe" : "Notify Me"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
