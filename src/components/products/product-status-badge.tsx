import { cn } from "@/lib/utils";
import type { ProductListStatus } from "@/lib/product-list-view";

const TONE_CLASSES: Record<ProductListStatus["tone"], string> = {
  available: "bg-[#E8F6ED] text-[#16A34A]",
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
