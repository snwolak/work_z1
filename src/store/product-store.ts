import { create } from "zustand";

import { MOCK_PRODUCTS } from "@/lib/mock-products";
import type { Product } from "@/lib/product";

type ProductStore = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: Product["id"]) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: MOCK_PRODUCTS,
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((item) =>
        item.id === product.id ? product : item,
      ),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((item) => item.id !== id),
    })),
}));
