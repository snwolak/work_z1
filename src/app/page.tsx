import { Suspense } from "react";

import { ProductTable } from "@/components/products/product-table";

export default function Home() {
  return (
    <main className="min-h-screen bg-muted">
      <Suspense
        fallback={
          <div
            aria-busy="true"
            aria-live="polite"
            className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-0 lg:py-[50px]"
          >
            <p className="text-sm text-muted-foreground">
              Ładowanie produktów…
            </p>
          </div>
        }
      >
        <ProductTable />
      </Suspense>
    </main>
  );
}
