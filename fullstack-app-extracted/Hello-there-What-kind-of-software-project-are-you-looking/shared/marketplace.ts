export type MarketplaceCategory =
  | "templates"
  | "plugins"
  | "themes"
  | "components"
  | "integrations";

export interface MarketplaceItem {
  id: number;
  name: string;
  category: MarketplaceCategory;
  price: string;
  rating: number;
  downloads: number;
  author: string;
  description: string;
  isPremium: boolean;
  tags: string[];
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
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
    tags: ["Analytics", "Dashboard", "Real-time"],
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
    tags: ["E-commerce", "Payment", "Conversion"],
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
    tags: ["AI", "Content", "Automation"],
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
    tags: ["Theming", "Branding", "Customization"],
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
    tags: ["Forms", "Builder", "Validation"],
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
    tags: ["Collaboration", "Real-time", "Team"],
  },
  {
    id: 7,
    name: "Global Sector Map Widget",
    category: "components",
    price: "$19",
    rating: 4.4,
    downloads: 540,
    author: "OmniGrid™ Team",
    description: "Interactive map component showing live sector activity across FAA.ZONE™",
    isPremium: false,
    tags: ["Map", "Sectors", "Visualization"],
  },
  {
    id: 8,
    name: "VaultMesh™ Integration Pack",
    category: "integrations",
    price: "$89",
    rating: 4.9,
    downloads: 420,
    author: "VaultMesh™ Team",
    description: "Full VaultDNA™, ScrollClaims™, and PulseGrid™ integration kit",
    isPremium: true,
    tags: ["VaultMesh", "ScrollClaims", "PulseGrid"],
  },
];

export function listMarketplaceItems(): MarketplaceItem[] {
  return MARKETPLACE_ITEMS.map((item) => ({ ...item, tags: [...item.tags] }));
}

export function getMarketplaceItemById(id: number): MarketplaceItem | null {
  const item = MARKETPLACE_ITEMS.find((entry) => entry.id === id);
  return item ? { ...item, tags: [...item.tags] } : null;
}
