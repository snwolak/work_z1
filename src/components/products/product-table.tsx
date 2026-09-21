"use client";

import { Plus } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { ProductTablePagination } from "@/components/products/product-table-pagination";
import { Button } from "@/components/ui/button";
import {
  PRODUCT_CATEGORY_LABELS,
  type Product,
  type ProductCategory,
} from "@/lib/product";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store/product-store";

const PAGE_SIZE = 5;

const columns = [
  { key: "name", label: "Nazwa", className: "min-w-[260px] lg:w-[29%]" },
  { key: "sku", label: "SKU", className: "min-w-[126px] lg:w-[13%]" },
  {
    key: "category",
    label: "Kategoria",
    className: "min-w-[132px] lg:w-[13%]",
  },
  {
    key: "grossPrice",
    label: "Cena Brutto",
    className: "min-w-[150px] lg:w-[15%]",
  },
  { key: "status", label: "Status", className: "min-w-[126px] lg:w-[13%]" },
  { key: "stock", label: "Magazyn", className: "min-w-[120px] lg:w-[17%]" },
] as const;

const pageParser = parseAsInteger.withDefault(1);

function formatProductCount(count: number) {
  if (count === 1) {
    return "1 produkt";
  }

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const isFew =
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14);

  return `${count} ${isFew ? "produkty" : "produktów"}`;
}

function formatPrice(product: Product) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: product.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.grossPrice);
}

function getStockLabel(product: Product) {
  if (!product.isLimited) {
    return "—";
  }

  return product.stockQuantity.toString();
}

function getCategoryLabel(category: ProductCategory) {
  return PRODUCT_CATEGORY_LABELS[category];
}

function ProductStatusBadge({ isAvailable }: { isAvailable: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
        isAvailable
          ? "bg-green-50 text-green-600"
          : "bg-destructive/10 text-destructive",
      )}
    >
      {isAvailable ? "Dostępny" : "Niedostępny"}
    </span>
  );
}

function ProductCards({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {products.map((product) => (
        <article
          key={product.id}
          className="rounded-lg border bg-card p-4 shadow-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-medium text-foreground">
                {product.name}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {product.sku}
              </p>
            </div>
            <ProductStatusBadge isAvailable={product.isAvailable} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Kategoria</dt>
              <dd className="mt-1 text-foreground">
                {getCategoryLabel(product.category)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Cena brutto</dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatPrice(product)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Magazyn</dt>
              <dd className="mt-1 text-foreground">{getStockLabel(product)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

export function ProductTable() {
  const products = useProductStore((state) => state.products);
  const [page, setPage] = useQueryState("page", pageParser);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleProducts = products.slice(pageStart, pageStart + PAGE_SIZE);

  function handlePageChange(nextPage: number) {
    void setPage(Math.min(Math.max(nextPage, 1), pageCount));
  }

  return (
    <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-0 lg:py-[50px]">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold leading-7 text-foreground">
            Produkty
          </h1>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {formatProductCount(products.length)} w katalogu
          </p>
        </div>

        <Button
          type="button"
          className="h-9 rounded-full bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Dodaj produkt
        </Button>
      </header>

      <ProductCards products={visibleProducts} />

      <div className="hidden overflow-hidden rounded-lg border bg-card shadow-xs md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b bg-muted">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn(
                      "h-10 px-4 text-sm font-medium text-muted-foreground",
                      column.className,
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id} className="border-b last:border-b">
                  <td className="h-12 px-4 text-sm font-medium text-foreground">
                    <span className="block truncate">{product.name}</span>
                  </td>
                  <td className="h-12 px-4 text-xs text-muted-foreground">
                    <span className="block truncate">{product.sku}</span>
                  </td>
                  <td className="h-12 px-4 text-sm text-muted-foreground">
                    <span className="block truncate">
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="h-12 px-4 text-sm font-medium text-foreground">
                    <span className="block truncate">
                      {formatPrice(product)}
                    </span>
                  </td>
                  <td className="h-12 px-4">
                    <ProductStatusBadge isAvailable={product.isAvailable} />
                  </td>
                  <td className="h-12 px-4 text-sm text-foreground">
                    {getStockLabel(product)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ProductTablePagination
          page={safePage}
          pageCount={pageCount}
          totalCount={products.length}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
