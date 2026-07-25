import {
  getMarketplaceItemById,
  listMarketplaceItems,
  type MarketplaceItem,
} from "@shared/marketplace";

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

export class FallbackMarketplaceProvider implements IMarketplaceAdapter {
  async getItems(): Promise<MarketplaceListResult> {
    const items = listMarketplaceItems();
    return { items, total: items.length, source: "fallback" };
  }

  async getItem(id: number): Promise<MarketplaceItem | null> {
    return getMarketplaceItemById(id);
  }
}

// ─── Remote adapter ───────────────────────────────────────────────────────────

export class RemoteMarketplaceAdapter implements IMarketplaceAdapter {
  private baseUrl: string;
  private fallback: IMarketplaceAdapter;

  constructor(baseUrl = "", fallback: IMarketplaceAdapter = new FallbackMarketplaceProvider()) {
    this.baseUrl = baseUrl;
    this.fallback = fallback;
  }

  async getItems(): Promise<MarketplaceListResult> {
    try {
      const res = await fetch(`${this.baseUrl}/api/marketplace/items`);
      if (!res.ok) throw new Error(`Marketplace API error ${res.status}`);
      const data: { items: MarketplaceItem[]; total: number } = await res.json();
      return { ...data, source: "remote" };
    } catch {
      return this.fallback.getItems();
    }
  }

  async getItem(id: number): Promise<MarketplaceItem | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/marketplace/items/${id}`);
      if (res.status === 404) return this.fallback.getItem(id);
      if (!res.ok) throw new Error(`Marketplace API error ${res.status}`);
      return res.json();
    } catch {
      return this.fallback.getItem(id);
    }
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
  const fallback = new FallbackMarketplaceProvider();

  if (apiBase) {
    return new RemoteMarketplaceAdapter(apiBase, fallback);
  }
  return fallback;
}

// Singleton adapter — initialised once at module load
export const marketplaceAdapter: IMarketplaceAdapter = createMarketplaceAdapter();
export type { MarketplaceItem };
