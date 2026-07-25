/**
 * Marketplace service — domain model, adapter interface, and fallback provider.
 *
 * Architecture:
 *  - MarketplaceItem   — canonical domain model
 *  - IMarketplaceAdapter — interface every provider must satisfy
 *  - FallbackMarketplaceProvider — static data used when no backend is available
 *  - RemoteMarketplaceAdapter  — fetches from /api/marketplace/items
 *  - createMarketplaceAdapter  — factory that picks the right provider at runtime
 */

// ─── Domain model ────────────────────────────────────────────────────────────

export interface MarketplaceItem {
  id: number;
  name: string;
  category: "templates" | "plugins" | "themes" | "components" | "integrations";
  price: string;
  rating: number;
  downloads: number;
  author: string;
  description: string;
  isPremium: boolean;
  tags: string[];
}

export interface MarketplaceListResult {
  items: MarketplaceItem[];
  total: number;
  source: "remote" | "fallback";
}

// ─── Adapter interface ────────────────────────────────────────────────────────

export interface IMarketplaceAdapter {
  /** Fetch all marketplace listings */
  getItems(): Promise<MarketplaceListResult>;
  /** Fetch a single item by id */
  getItem(id: number): Promise<MarketplaceItem | null>;
}

// ─── Fallback provider (static seed data) ────────────────────────────────────

const FALLBACK_ITEMS: MarketplaceItem[] = [
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

export class FallbackMarketplaceProvider implements IMarketplaceAdapter {
  async getItems(): Promise<MarketplaceListResult> {
    return { items: FALLBACK_ITEMS, total: FALLBACK_ITEMS.length, source: "fallback" };
  }

  async getItem(id: number): Promise<MarketplaceItem | null> {
    return FALLBACK_ITEMS.find((i) => i.id === id) ?? null;
  }
}

// ─── Remote adapter ───────────────────────────────────────────────────────────

export class RemoteMarketplaceAdapter implements IMarketplaceAdapter {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  async getItems(): Promise<MarketplaceListResult> {
    const res = await fetch(`${this.baseUrl}/api/marketplace/items`);
    if (!res.ok) throw new Error(`Marketplace API error ${res.status}`);
    const data: { items: MarketplaceItem[]; total: number } = await res.json();
    return { ...data, source: "remote" };
  }

  async getItem(id: number): Promise<MarketplaceItem | null> {
    const res = await fetch(`${this.baseUrl}/api/marketplace/items/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Marketplace API error ${res.status}`);
    return res.json();
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Returns a RemoteMarketplaceAdapter when the environment exposes a backend URL,
 * otherwise returns the FallbackMarketplaceProvider.  This ensures the app
 * always has a working marketplace even without a configured backend.
 */
export function createMarketplaceAdapter(): IMarketplaceAdapter {
  // Vite injects VITE_* vars at build time via import.meta.env
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (import.meta as any).env as Record<string, string> | undefined;
  const apiBase = env?.VITE_MARKETPLACE_API_URL ?? "";

  if (typeof window !== "undefined" && apiBase) {
    return new RemoteMarketplaceAdapter(apiBase);
  }
  return new FallbackMarketplaceProvider();
}

// Singleton adapter — initialised once at module load
export const marketplaceAdapter: IMarketplaceAdapter = createMarketplaceAdapter();
