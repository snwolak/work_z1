"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductTablePaginationProps = {
  page: number;
  pageCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  variant?: "bar" | "stacked";
};

export function ProductTablePagination({
  page,
  pageCount,
  totalCount,
  onPageChange,
  variant = "bar",
}: ProductTablePaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
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

      {pages.map((item) => (
        <Button
          key={item}
          type="button"
          variant={item === page ? "default" : "ghost"}
          size="icon"
          className={cn(
            "size-8 rounded-md text-sm border-0 text-foreground",
            item === page && "bg-primary text-white hover:bg-primary/90",
          )}
          aria-current={item === page ? "page" : undefined}
          onClick={() => onPageChange(item)}
        >
          {item}
        </Button>
      ))}

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

  const caption = `Strona ${page} z ${pageCount} · ${totalCount} produktów`;

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
