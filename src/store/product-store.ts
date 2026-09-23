import { create } from "zustand";

import { MOCK_PRODUCTS } from "@/lib/mock-products";
import type { Product } from "@/lib/product";

type ProductStore = {
  products: Product[];
  addProduct: (product: Product) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: MOCK_PRODUCTS,
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
}));
