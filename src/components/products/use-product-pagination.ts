import { useEffect } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

import {
  clampPage,
  getVisiblePages,
  pageCountForCount,
  sliceForPage,
} from "@/lib/pagination";
import { useProductStore } from "@/store/product-store";

const pageParam = parseAsInteger.withDefault(1);

export function useProductPagination() {
  const products = useProductStore((state) => state.products);
  const [requestedPage, setRequestedPage] = useQueryState("page", pageParam);

  const totalCount = products.length;
  const pageCount = pageCountForCount(totalCount);
  const page = clampPage(requestedPage, pageCount);
  const visibleProducts = sliceForPage(products, page);
  const pageNumbers = getVisiblePages(page, pageCount);

  useEffect(() => {
    if (requestedPage !== page) {
      void setRequestedPage(page);
    }
  }, [requestedPage, page, setRequestedPage]);

  // Handlers read getState() for a fresh count: closures may hold products
  // from before the write they respond to (e.g. goToLastPage after add).
  function changePage(nextPage: number) {
    const count = useProductStore.getState().products.length;

    void setRequestedPage(clampPage(nextPage, pageCountForCount(count)));
  }

  function goToLastPage() {
    const count = useProductStore.getState().products.length;

    void setRequestedPage(pageCountForCount(count));
  }

  return {
    totalCount,
    pageCount,
    page,
    pageNumbers,
    visibleProducts,
    changePage,
    goToLastPage,
  };
}
