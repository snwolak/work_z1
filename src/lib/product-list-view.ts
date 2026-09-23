import { formatGrossPrice } from "@/lib/format-product";
import { PRODUCT_CATEGORY_LABELS, type Product } from "@/lib/product";

export type ProductStatusTone = "available" | "unavailable";

export type ProductListStatus = {
  tone: ProductStatusTone;
  label: string;
};

export type ProductListViewModel = {
  id: string;
  name: string;
  sku: string;
  category: string;
  grossPrice: string;
  status: ProductListStatus;
  stock: string;
};

export function toProductListStatus(isAvailable: boolean): ProductListStatus {
  return isAvailable
    ? { tone: "available", label: "Dostępny" }
    : { tone: "unavailable", label: "Niedostępny" };
}

export function toProductListViewModel(product: Product): ProductListViewModel {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: PRODUCT_CATEGORY_LABELS[product.category],
    grossPrice: formatGrossPrice(product),
    status: toProductListStatus(product.isAvailable),
    stock: product.isLimited ? String(product.stockQuantity) : "—",
  };
}

export function toProductListViewModels(
  products: Product[],
): ProductListViewModel[] {
  return products.map(toProductListViewModel);
}
