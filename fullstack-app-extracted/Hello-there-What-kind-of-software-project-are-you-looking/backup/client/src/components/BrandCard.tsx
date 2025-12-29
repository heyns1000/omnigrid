import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Brand } from "@shared/schema";

interface BrandCardProps {
  brand: Brand;
  delay?: number;
}

export default function BrandCard({ brand, delay = 0 }: BrandCardProps) {
  const handleConfigure = () => {
    console.log("Configuring brand:", brand.name);
    // TODO: Open brand configuration modal or navigate to brand page
  };

  const getBrandColorClass = (brandName: string) => {
    switch (brandName.toLowerCase()) {
      case "seedwave":
      case "seedwave™":
        return "brand-seedwave";
      case "vaultmesh":
      case "vaultmesh™":
        return "brand-vaultmesh";
      case "banimal":
      case "banimal™":
        return "brand-banimal";
      case "fruitful global":
      case "fruitful global™":
        return "brand-fruitful";
      default:
        return "brand-fruitful";
    }
  };

  const getStatusList = (brandName: string) => {
    switch (brandName.toLowerCase()) {
      case "seedwave":
      case "seedwave™":
        return [
          { name: "Global Hub", status: "online" as const },
          { name: "Analytics Engine", status: "online" as const },
          { name: "Chart.js Integration", status: "online" as const },
          { name: "Spotify Features", status: "online" as const },
        ];
      case "vaultmesh":
      case "vaultmesh™":
        return [
          { name: "Checkout System", status: "online" as const },
          { name: "PayPal SDK", status: "online" as const },
          { name: "FCU Currency", status: "online" as const },
          { name: "SecureSign Auth", status: "online" as const },
        ];
      case "banimal":
      case "banimal™":
        return [
          { name: "Loop Checkout", status: "online" as const },
          { name: "Green Payments", status: "online" as const },
          { name: "Eco Analytics", status: "online" as const },
          { name: "Sustainability Index", status: "online" as const },
        ];
      case "fruitful global":
      case "fruitful global™":
        return [
          { name: "Legal Framework", status: "online" as const },
          { name: "i18n System", status: "online" as const },
          { name: "Privacy/Terms", status: "online" as const },
          { name: "Corporate Index", status: "online" as const },
        ];
      default:
        return [
          { name: "Core System", status: "online" as const },
          { name: "Templates", status: "online" as const },
          { name: "Analytics", status: "online" as const },
          { name: "Deployment", status: "online" as const },
        ];
    }
  };

  const statusList = getStatusList(brand.name);

  return (
    <Card 
      className={`brand-card animate-slide-up ${getBrandColorClass(brand.name)}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">{brand.icon}</span>
          </div>
          <h4 className="text-xl font-bold mb-2">{brand.name}</h4>
          <p className="text-sm text-muted-foreground mb-4">
            {brand.description || "Enterprise-grade platform solution"}
          </p>
        </div>
        
        <div className="space-y-3 mb-4">
          {statusList.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span>{item.name}</span>
              <Badge variant={item.status === "online" ? "default" : "secondary"} className="text-xs">
                <div className={`status-indicator status-${item.status} mr-1`}></div>
                {item.status === "online" ? "Active" : "Inactive"}
              </Badge>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleConfigure}
          className="w-full"
          style={{ backgroundColor: brand.primaryColor }}
        >
          Configure Brand
        </Button>
      </CardContent>
    </Card>
  );
}
