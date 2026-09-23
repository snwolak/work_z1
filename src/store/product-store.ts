import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { isProductList, type Product } from "@/lib/product";

type ProductStore = {
  products: Product[];
  addProduct: (product: Product) => void;
};

// Exact shape written by partialize() and read back by merge(). One named
// type so the two sides cannot drift apart.
type PersistedProductState = {
  products: Product[];
};

function isPersistedProductState(
  value: unknown,
): value is PersistedProductState {
  return (
    typeof value === "object" &&
    value !== null &&
    "products" in value &&
    isProductList(value.products)
  );
}

// Single gateway to the zustand persist API. Every access is optional-chained
// here — the render phase must survive a store without the persist middleware
// (e.g. stale dev SSR chunk after edits) — so call sites never repeat the
// guard or its comment.
export function rehydrateProductStoreState(): void {
  void useProductStore.persist?.rehydrate();
}

export function hasProductStoreHydrated(): boolean {
  return useProductStore.persist?.hasHydrated() ?? false;
}

export function onProductStoreHydrated(
  listener: () => void,
): (() => void) | undefined {
  return useProductStore.persist?.onFinishHydration(listener);
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
      partialize: (state): PersistedProductState => ({
        products: state.products,
      }),
      storage: createJSONStorage(() => localStorage),
      // SSR-safe: no storage access during module init / prerender.
      // Rehydration happens on mount via useRehydrateProductStore().
      skipHydration: true,
      merge: (persistedState, currentState) => ({
        ...currentState,
        products: isPersistedProductState(persistedState)
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
    rehydrateProductStoreState();
  }, []);
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  // Watchdog: skipHydration fails silently when rehydrate() is never called.
  // Never let that failure mode be quiet again.
  window.setTimeout(() => {
    if (!hasProductStoreHydrated()) {
      console.warn(
        "[product-store] persist did not hydrate within 3s. " +
          "Ensure useRehydrateProductStore() is mounted, e.g. in the root layout.",
      );
    }
  }, 3000);
}
