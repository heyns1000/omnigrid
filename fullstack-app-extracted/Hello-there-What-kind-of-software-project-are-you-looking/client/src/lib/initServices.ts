/**
 * initServices — called once at app startup to register and warm up platform services.
 *
 * Keeps boot logic out of individual components so pages remain unaware of
 * infrastructure concerns.  New services should be added here.
 */

import { marketplaceAdapter } from "@/services/marketplace";

let _initialised = false;

export async function initServices(): Promise<void> {
  if (_initialised) return;
  _initialised = true;

  console.info("[OmniGrid] Initialising platform services…");

  // Pre-warm marketplace adapter so first page load has data ready
  try {
    await marketplaceAdapter.getItems();
    console.info("[OmniGrid] ✅ Marketplace adapter ready");
  } catch (err) {
    // Non-fatal — the UI falls back to static data automatically
    console.warn("[OmniGrid] ⚠️  Marketplace remote unreachable, using fallback:", err);
  }

  console.info("[OmniGrid] Platform services initialised");
}
