import { ProductStatusBadge } from "@/components/products/product-status-badge";
import type { ProductListViewModel } from "@/lib/product-list-view";

type ProductCardsProps = {
  items: ProductListViewModel[];
};

export function ProductCards({ items }: ProductCardsProps) {
  return (
    <div className="grid gap-2 md:hidden">
      {items.map((item) => (
        <article key={item.id} className="rounded-[12px] border bg-card p-3">
          <div className="flex items-center justify-between gap-2.5">
            <div className="min-w-0">
              <h2 className="truncate text-base font-medium text-foreground">
                {item.name}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">{item.sku}</p>
            </div>
            <ProductStatusBadge status={item.status} />
          </div>

          <dl className="mt-2 grid grid-cols-3 gap-1 rounded-[9px] bg-muted p-3">
            <div>
              <dt className="text-xs text-muted-foreground">Kategoria</dt>
              <dd className="mt-1 text-sm text-foreground">{item.category}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Cena brutto</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {item.grossPrice}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Magazyn</dt>
              <dd className="mt-1 text-sm text-foreground">{item.stock}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
