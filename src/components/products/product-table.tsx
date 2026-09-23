"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { AddProductDialog } from "@/components/products/add-product-dialog";
import { ProductCards } from "@/components/products/product-cards";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { ProductTablePagination } from "@/components/products/product-table-pagination";
import { useProductPagination } from "@/components/products/use-product-pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatProductCount } from "@/lib/format-product";
import { toProductListViewModels } from "@/lib/product-list-view";
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
    pageNumbers,
    visibleProducts,
    isReady,
    changePage,
    goToLastPage,
  } = useProductPagination();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const visibleItems = toProductListViewModels(visibleProducts);

  // Skeleton until the persisted catalog loads: the store boots from the
  // seed, so rendering immediately would flash the wrong (clamped) page
  // before rehydration swaps in the real products.
  if (!isReady) {
    return (
      <section
        aria-busy="true"
        aria-live="polite"
        className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-6 sm:px-6 md:gap-6 lg:px-0 lg:py-[50px]"
      >
        <span className="sr-only">Ładowanie produktów…</span>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-44" />
          </div>
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
        <Skeleton className="h-72 w-full rounded-lg" />
      </section>
    );
  }

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
          <ProductCards items={visibleItems} />

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
                  {visibleItems.map((item) => (
                    <tr key={item.id} className="border-b last:border-b">
                      <td className="h-12 px-4 text-sm font-medium text-foreground">
                        <span className="block truncate">{item.name}</span>
                      </td>
                      <td className="h-12 px-4 text-xs text-muted-foreground">
                        <span className="block truncate">{item.sku}</span>
                      </td>
                      <td className="h-12 px-4 text-sm text-muted-foreground">
                        <span className="block truncate">{item.category}</span>
                      </td>
                      <td className="h-12 px-4 text-sm font-medium text-foreground">
                        <span className="block truncate">
                          {item.grossPrice}
                        </span>
                      </td>
                      <td className="h-12 px-4">
                        <ProductStatusBadge status={item.status} />
                      </td>
                      <td className="h-12 px-4 text-sm text-foreground">
                        {item.stock}
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
              pageNumbers={pageNumbers}
              onPageChange={changePage}
            />
          </div>

          <div className="mt-2 md:hidden">
            <ProductTablePagination
              variant="stacked"
              page={page}
              pageCount={pageCount}
              totalCount={totalCount}
              pageNumbers={pageNumbers}
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
