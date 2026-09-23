"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { AddProductDialog } from "@/components/products/add-product-dialog";
import { ProductCards } from "@/components/products/product-cards";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { ProductTablePagination } from "@/components/products/product-table-pagination";
import { useProductPagination } from "@/components/products/use-product-pagination";
import { Button } from "@/components/ui/button";
import {
  formatGrossPrice,
  formatProductCount,
  formatStockQuantity,
} from "@/lib/format-product";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/product";
import { cn } from "@/lib/utils";

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

export function ProductTable() {
  const {
    totalCount,
    pageCount,
    page,
    visibleProducts,
    changePage,
    goToLastPage,
  } = useProductPagination();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  return (
    <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-6 sm:px-6 md:gap-6 lg:px-0 lg:py-[50px]">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold leading-7 text-foreground">
            Produkty
          </h1>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {formatProductCount(totalCount)} w katalogu
          </p>
        </div>

        <Button
          type="button"
          className="h-9 rounded-full bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsAddProductOpen(true)}
        >
          <Plus className="size-4" aria-hidden="true" />
          Dodaj produkt
        </Button>
      </header>

      {totalCount === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-card px-4 py-12 text-center">
          <p className="text-base font-medium text-foreground">
            Brak produktów w katalogu
          </p>
          <p className="text-sm text-muted-foreground">
            Dodaj pierwszy produkt, aby zobaczyć go na liście.
          </p>
          <Button
            type="button"
            className="mt-1 h-9 rounded-full bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsAddProductOpen(true)}
          >
            <Plus className="size-4" aria-hidden="true" />
            Dodaj produkt
          </Button>
        </div>
      ) : (
        <>
          <ProductCards products={visibleProducts} />

          <div className="hidden overflow-hidden rounded-lg border bg-card shadow-xs md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b bg-[#F9FAFB]">
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
                          {PRODUCT_CATEGORY_LABELS[product.category]}
                        </span>
                      </td>
                      <td className="h-12 px-4 text-sm font-medium text-foreground">
                        <span className="block truncate">
                          {formatGrossPrice(product)}
                        </span>
                      </td>
                      <td className="h-12 px-4">
                        <ProductStatusBadge isAvailable={product.isAvailable} />
                      </td>
                      <td className="h-12 px-4 text-sm text-foreground">
                        {formatStockQuantity(product)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ProductTablePagination
              page={page}
              pageCount={pageCount}
              totalCount={totalCount}
              onPageChange={changePage}
            />
          </div>

          <div className="mt-2 md:hidden">
            <ProductTablePagination
              variant="stacked"
              page={page}
              pageCount={pageCount}
              totalCount={totalCount}
              onPageChange={changePage}
            />
          </div>
        </>
      )}

      <AddProductDialog
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        onProductAdded={goToLastPage}
      />
    </section>
  );
}
