import { parseAsInteger, useQueryState } from "nuqs";

import { useProductStore } from "@/store/product-store";

export const PRODUCT_PAGE_SIZE = 5;

const pageParam = parseAsInteger.withDefault(1);

function clampPage(requestedPage: number, pageCount: number) {
  return Math.min(Math.max(requestedPage, 1), pageCount);
}

export function useProductPagination() {
  const products = useProductStore((state) => state.products);
  const [requestedPage, setRequestedPage] = useQueryState("page", pageParam);

  const totalCount = products.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PRODUCT_PAGE_SIZE));
  const page = clampPage(requestedPage, pageCount);
  const visibleProducts = products.slice(
    (page - 1) * PRODUCT_PAGE_SIZE,
    page * PRODUCT_PAGE_SIZE,
  );

  function changePage(nextPage: number) {
    void setRequestedPage(clampPage(nextPage, pageCount));
  }

  function goToLastPage() {
    const count = useProductStore.getState().products.length;

    void setRequestedPage(Math.max(1, Math.ceil(count / PRODUCT_PAGE_SIZE)));
  }

  return {
    totalCount,
    pageCount,
    page,
    visibleProducts,
    changePage,
    goToLastPage,
  };
}
