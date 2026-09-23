"use client";

import { useRehydrateProductStore } from "@/store/product-store";

// Mounted once in the root layout. Keeps store rehydration next to the
// layout instead of a feature component, so UI refactors cannot silently
// disable persistence again.
export function RehydrateProductStore() {
  useRehydrateProductStore();

  return null;
}
