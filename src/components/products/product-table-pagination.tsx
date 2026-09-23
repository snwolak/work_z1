"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatProductCount } from "@/lib/format-product";
import { cn } from "@/lib/utils";

type ProductTablePaginationProps = {
  page: number;
  pageCount: number;
  totalCount: number;
  pageNumbers: number[];
  onPageChange: (page: number) => void;
  variant?: "bar" | "stacked";
};

export function ProductTablePagination({
  page,
  pageCount,
  totalCount,
  pageNumbers,
  onPageChange,
  variant = "bar",
}: ProductTablePaginationProps) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= pageCount;

  const nav = (
    <nav
      aria-label="Paginacja tabeli produktów"
      className="flex items-center gap-0.5"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-1 rounded-md pl-1.5 pr-2.5 text-sm border-0 text-foreground"
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Wstecz
      </Button>

      {pageNumbers.map((pageNumber, index) => {
        const previous = pageNumbers[index - 1];
        const showEllipsis =
          previous !== undefined && pageNumber - previous > 1;

        return (
          <span key={pageNumber} className="flex items-center gap-0.5">
            {showEllipsis ? (
              <span aria-hidden="true" className="px-1 text-muted-foreground">
                …
              </span>
            ) : null}
            <Button
              type="button"
              variant={pageNumber === page ? "default" : "ghost"}
              size="icon"
              className={cn(
                "size-8 rounded-md text-sm border-0 text-foreground",
                pageNumber === page &&
                  "bg-primary text-white hover:bg-primary/90",
              )}
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          </span>
        );
      })}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 gap-1 rounded-md pl-2.5 pr-1.5 text-sm border-0 text-foreground"
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        Dalej
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </nav>
  );

  const caption = `Strona ${page} z ${pageCount} · ${formatProductCount(totalCount)}`;

  if (variant === "stacked") {
    return (
      <div className="flex flex-col items-center gap-4 text-xs text-muted-foreground">
        <p className="text-center">{caption}</p>
        {nav}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 bg-[#F9FAFB] px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>{caption}</p>
      {nav}
    </div>
  );
}
