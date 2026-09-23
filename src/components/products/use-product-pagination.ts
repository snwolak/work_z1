import { useEffect, useState, useSyncExternalStore } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import {
  clampPage,
  getVisiblePages,
  pageCountForCount,
  sliceForPage,
} from "@/lib/pagination";
import {
  hasProductStoreHydrated,
  onProductStoreHydrated,
  useProductStore,
} from "@/store/product-store";

const pageParam = parseAsInteger.withDefault(1);

function subscribeToProductStoreHydration(listener: () => void): () => void {
  return onProductStoreHydrated(listener) ?? (() => undefined);
}

function getProductStoreHydratedSnapshot(): boolean {
  return hasProductStoreHydrated();
}

function getProductStoreServerSnapshot(): boolean {
  return false;
}

export function useProductPagination() {
  const products = useProductStore((state) => state.products);
  const [requestedPage, setRequestedPage] = useQueryState("page", pageParam);

  const totalCount = products.length;
  const pageCount = pageCountForCount(totalCount);
  const page = clampPage(requestedPage, pageCount);
  const visibleProducts = sliceForPage(products, page);
  const pageNumbers = getVisiblePages(page, pageCount);

  // Boot count is captured once on mount: the store always starts from the
  // seed (skipHydration) and the catalog only grows via addProduct, so a
  // count different from the boot count proves settled (rehydrated/added)
  // data. Normalize the URL only then: clamping a valid ?page= against
  // transient seed data irreversibly destroys it, and neither the persist
  // flag nor a local hydrated latch can gate this — both were observed true
  // while the component still rendered seed products. Out-of-range URLs with
  // unsettled data simply render the clamped page.
  const [bootCount] = useState(products.length);
  const isSettled = products.length !== bootCount;

  // Readiness gate (skeleton until true). The server snapshot keeps SSR and
  // the hydration render on false; the client snapshot is only read
  // post-hydration, so a flipped persist flag can never mismatch the server
  // HTML. Reading hasProductStoreHydrated() directly during render does
  // mismatch whenever the client's flag differs from the server's false.
  const isReady = useSyncExternalStore(
    subscribeToProductStoreHydration,
    getProductStoreHydratedSnapshot,
    getProductStoreServerSnapshot,
  );

  useEffect(() => {
    if (isSettled && requestedPage !== page) {
      void setRequestedPage(page);
    }
  }, [isSettled, requestedPage, page, setRequestedPage]);

  // Handlers read getState() for a fresh count: closures may hold products
  // from before the write they respond to (e.g. goToLastPage after add).
  function changePage(nextPage: number): void {
    const count = useProductStore.getState().products.length;

    void setRequestedPage(clampPage(nextPage, pageCountForCount(count)));
  }

  function goToLastPage(): void {
    const count = useProductStore.getState().products.length;

    void setRequestedPage(pageCountForCount(count));
  }

  return {
    totalCount,
    pageCount,
    page,
    pageNumbers,
    visibleProducts,
    isReady,
    changePage,
    goToLastPage,
  };
}
