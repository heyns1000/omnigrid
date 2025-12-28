import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Sector } from "@shared/schema";

interface SectorNavigationProps {
  sectors: Sector[];
}

export default function SectorNavigation({ sectors }: SectorNavigationProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const sectorCategories = [
    { id: "all", label: "All Sectors", icon: "🌐" },
    { id: "technology", label: "Technology", icon: "💻" },
    { id: "healthcare", label: "Healthcare", icon: "🏥" },
    { id: "finance", label: "Finance", icon: "💰" },
    { id: "logistics", label: "Logistics", icon: "🚚" },
    { id: "media", label: "Media", icon: "📺" },
    { id: "retail", label: "Retail", icon: "🛒" },
  ];

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    console.log("Loading sector category:", categoryId);
    // TODO: Filter sectors and update analytics based on category
  };

  const filteredSectors = activeCategory === "all" 
    ? sectors 
    : sectors.filter(sector => 
        sector.slug.includes(activeCategory) || 
        sector.name.toLowerCase().includes(activeCategory)
      );

  return (
    <div className="space-y-6">
      {/* Sector Categories */}
      <div className="sector-nav justify-center">
        {sectorCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => handleCategoryChange(category.id)}
            className="sector-tab"
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>

      {/* Sector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSectors.length > 0 ? (
          filteredSectors.map((sector) => (
            <div
              key={sector.id}
              className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => console.log("Selected sector:", sector.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{sector.icon}</span>
                  <div>
                    <h4 className="font-semibold text-sm">{sector.name}</h4>
                    <p className="text-xs text-muted-foreground">{sector.slug}</p>
                  </div>
                </div>
                <Badge 
                  variant={sector.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {sector.status}
                </Badge>
              </div>
              
              {sector.description && (
                <p className="text-xs text-muted-foreground mt-2">
                  {sector.description}
                </p>
              )}
              
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  CI Color: {sector.ciColor}
                </div>
                <div className={`w-4 h-4 rounded-full bg-${sector.ciColor}-500`}></div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              No sectors found for the selected category.
            </p>
          </div>
        )}
      </div>

      {/* Sector Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-primary">{sectors.length}</div>
          <div className="text-sm text-muted-foreground">Total Sectors</div>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {sectors.filter(s => s.status === "active").length}
          </div>
          <div className="text-sm text-muted-foreground">Active Sectors</div>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{filteredSectors.length}</div>
          <div className="text-sm text-muted-foreground">Filtered Results</div>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-purple-600">∞</div>
          <div className="text-sm text-muted-foreground">Scalability</div>
        </div>
      </div>
    </div>
  );
}
