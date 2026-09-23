import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { formatGrossPrice, formatStockQuantity } from "@/lib/format-product";
import { PRODUCT_CATEGORY_LABELS, type Product } from "@/lib/product";

type ProductCardsProps = {
  products: Product[];
};

export function ProductCards({ products }: ProductCardsProps) {
  return (
    <div className="grid gap-2 md:hidden">
      {products.map((product) => (
        <article key={product.id} className="rounded-[12px] border bg-card p-3">
          <div className="flex items-center justify-between gap-2.5">
            <div className="min-w-0">
              <h2 className="truncate text-base font-medium text-foreground">
                {product.name}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {product.sku}
              </p>
            </div>
            <ProductStatusBadge isAvailable={product.isAvailable} />
          </div>

          <dl className="mt-2 grid grid-cols-3 gap-1 rounded-[9px] bg-muted p-3">
            <div>
              <dt className="text-xs text-muted-foreground">Kategoria</dt>
              <dd className="mt-1 text-sm text-foreground">
                {PRODUCT_CATEGORY_LABELS[product.category]}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Cena brutto</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {formatGrossPrice(product)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Magazyn</dt>
              <dd className="mt-1 text-sm text-foreground">
                {formatStockQuantity(product)}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
