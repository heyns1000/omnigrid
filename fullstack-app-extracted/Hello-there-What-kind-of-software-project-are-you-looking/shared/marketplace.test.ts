import test from "node:test";
import assert from "node:assert/strict";
import { getMarketplaceItemById, listMarketplaceItems } from "./marketplace";

test("marketplace catalog returns cloned listing data", () => {
  const first = listMarketplaceItems();
  const second = listMarketplaceItems();

  assert.equal(first.length, 8);
  assert.notEqual(first, second);
  assert.notEqual(first[0], second[0]);
  assert.deepEqual(first[0], second[0]);
});

test("marketplace detail lookup returns expected item", () => {
  const item = getMarketplaceItemById(8);

  assert.ok(item);
  assert.equal(item.name, "VaultMesh™ Integration Pack");
  assert.deepEqual(item.tags, ["VaultMesh", "ScrollClaims", "PulseGrid"]);
});

test("marketplace detail lookup returns null for missing item", () => {
  assert.equal(getMarketplaceItemById(999), null);
});
