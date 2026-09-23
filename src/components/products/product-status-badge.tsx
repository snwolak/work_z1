import { cn } from "@/lib/utils";
import type { ProductListStatus } from "@/lib/product-list-view";

const TONE_CLASSES: Record<ProductListStatus["tone"], string> = {
  available:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  unavailable: "bg-destructive/10 text-destructive",
};

type ProductStatusBadgeProps = {
  status: ProductListStatus;
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
        TONE_CLASSES[status.tone],
      )}
    >
      {status.label}
    </span>
  );
}
