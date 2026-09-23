import type { Product } from "@/lib/product";

const priceFormatters = new Map<Product["currency"], Intl.NumberFormat>();

function priceFormatter(currency: Product["currency"]) {
  const cached = priceFormatters.get(currency);

  if (cached) {
    return cached;
  }

  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  priceFormatters.set(currency, formatter);

  return formatter;
}

export function formatGrossPrice(
  product: Pick<Product, "grossPrice" | "currency">,
): string {
  return priceFormatter(product.currency).format(product.grossPrice);
}

export function formatProductCount(count: number): string {
  if (count === 1) {
    return "1 produkt";
  }

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const isFew =
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14);

  return `${count} ${isFew ? "produkty" : "produktów"}`;
}
