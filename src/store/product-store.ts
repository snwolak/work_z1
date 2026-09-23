import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { MOCK_PRODUCTS } from "@/lib/mock-products";
import type { Product } from "@/lib/product";

type ProductStore = {
  products: Product[];
  addProduct: (product: Product) => void;
};

function isProductList(value: unknown): value is Product[] {
  return Array.isArray(value);
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      // Copy: the store must never alias the seed array.
      products: [...MOCK_PRODUCTS],
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
    }),
    {
      name: "product-store",
      version: 1,
      // No functions in state, but partialize keeps storage explicit.
      partialize: (state) => ({ products: state.products }),
      storage: createJSONStorage(() => localStorage),
      // SSR-safe: no storage access during module init / prerender.
      // Rehydration happens on mount via useRehydrateProductStore().
      skipHydration: true,
      merge: (persistedState, currentState) => ({
        ...currentState,
        products:
          typeof persistedState === "object" &&
          persistedState !== null &&
          "products" in persistedState &&
          isProductList(persistedState.products)
            ? persistedState.products
            : currentState.products,
      }),
    },
  ),
);

// Rehydration lives next to the store on purpose: the previous wiring called
// rehydrate() from an unrelated UI component, which silently disappeared and
// left persist write-only. Mount this hook once, e.g. in the root layout.
export function useRehydrateProductStore() {
  useEffect(() => {
    void useProductStore.persist.rehydrate();
  }, []);
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  // Watchdog: skipHydration fails silently when rehydrate() is never called.
  // Never let that failure mode be quiet again.
  window.setTimeout(() => {
    if (!useProductStore.persist.hasHydrated()) {
      console.warn(
        "[product-store] persist did not hydrate within 3s. " +
          "Ensure useRehydrateProductStore() is mounted, e.g. in the root layout.",
      );
    }
  }, 3000);
}
