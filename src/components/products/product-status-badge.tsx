import { cn } from "@/lib/utils";

type ProductStatusBadgeProps = {
  isAvailable: boolean;
};

export function ProductStatusBadge({ isAvailable }: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
        isAvailable
          ? "bg-[#E8F6ED] text-[#16A34A]"
          : "bg-destructive/10 text-destructive",
      )}
    >
      {isAvailable ? "Dostępny" : "Niedostępny"}
    </span>
  );
}
