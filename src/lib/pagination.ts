export const PRODUCT_PAGE_SIZE = 5;

const MAX_VISIBLE_PAGES = 7;

export function pageCountForCount(totalCount: number) {
  return Math.max(1, Math.ceil(totalCount / PRODUCT_PAGE_SIZE));
}

export function clampPage(requestedPage: number, pageCount: number) {
  return Math.min(Math.max(requestedPage, 1), pageCount);
}

export function sliceForPage<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * PRODUCT_PAGE_SIZE, page * PRODUCT_PAGE_SIZE);
}

export function getVisiblePages(page: number, pageCount: number): number[] {
  if (pageCount <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const visiblePages = new Set([
    1,
    2,
    page - 1,
    page,
    page + 1,
    pageCount - 1,
    pageCount,
  ]);

  return [...visiblePages]
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= pageCount)
    .sort((a, b) => a - b);
}
