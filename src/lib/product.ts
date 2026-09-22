import { z } from "zod";

export const PRODUCT_MANUFACTURERS = [
  "acme",
  "globex",
  "initech",
  "umbrella",
] as const;

export const PRODUCT_CATEGORIES = [
  "electronics",
  "clothing",
  "home",
  "sports",
] as const;

export const PRODUCT_FEATURES = [
  "new",
  "bestseller",
  "eco-friendly",
  "limited-edition",
  "discounted",
] as const;

export const PRODUCT_CURRENCIES = ["PLN", "EUR", "USD"] as const;

export const PRODUCT_VAT_RATES = [0, 5, 8, 23] as const;

export type ProductManufacturer = (typeof PRODUCT_MANUFACTURERS)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductFeature = (typeof PRODUCT_FEATURES)[number];
export type ProductCurrency = (typeof PRODUCT_CURRENCIES)[number];
export type ProductVatRate = (typeof PRODUCT_VAT_RATES)[number];

export const PRODUCT_MANUFACTURER_LABELS: Record<ProductManufacturer, string> =
  {
    acme: "Acme",
    globex: "Globex",
    initech: "Initech",
    umbrella: "Umbrella",
  };

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  electronics: "Elektronika",
  clothing: "Odzież",
  home: "Dom i ogród",
  sports: "Sport",
};

export const PRODUCT_FEATURE_LABELS: Record<ProductFeature, string> = {
  new: "Nowość",
  bestseller: "Bestseller",
  "eco-friendly": "Eko",
  "limited-edition": "Edycja limitowana",
  discounted: "Promocja",
};

export const PRODUCT_CURRENCY_LABELS: Record<ProductCurrency, string> = {
  PLN: "Polski złoty (PLN)",
  EUR: "Euro (EUR)",
  USD: "Dolar amerykański (USD)",
};

export const PRODUCT_VAT_RATE_LABELS: Record<ProductVatRate, string> = {
  0: "0%",
  5: "5%",
  8: "8%",
  23: "23%",
};

const DECIMAL_SEPARATOR = ",";
const PRICE_DECIMALS = 2;
const PRICE_TOLERANCE = 0.005;

function toNumberInput(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed.replace(DECIMAL_SEPARATOR, ".");
}

function numberField(params: {
  invalid: string;
  integer?: string;
  nonnegative?: string;
}) {
  let schema = z.coerce.number({ message: params.invalid });

  if (params.integer) {
    schema = schema.int(params.integer);
  }

  if (params.nonnegative) {
    schema = schema.nonnegative(params.nonnegative);
  }

  return z.preprocess(toNumberInput, schema);
}

function optionalNumberField(params: {
  invalid: string;
  integer?: string;
  nonnegative?: string;
}) {
  let schema = z.coerce.number({ message: params.invalid });

  if (params.integer) {
    schema = schema.int(params.integer);
  }

  if (params.nonnegative) {
    schema = schema.nonnegative(params.nonnegative);
  }

  return z.preprocess(toNumberInput, schema.optional());
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}

const priceAmountSchema = (invalid: string, nonnegative: string) =>
  numberField({ invalid, nonnegative });

export const productBasicInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nazwa produktu musi mieć co najmniej 3 znaki."),
  sku: z
    .string()
    .trim()
    .min(1, "SKU jest wymagane.")
    .max(24, "SKU może mieć maksymalnie 24 znaki.")
    .regex(/^[A-Za-z0-9]+$/, "SKU może zawierać wyłącznie litery i cyfry."),
  description: z.string().trim().optional(),
  manufacturer: z.enum(PRODUCT_MANUFACTURERS, {
    message: "Wybierz producenta.",
  }),
  category: z.enum(PRODUCT_CATEGORIES, { message: "Wybierz kategorię." }),
  features: z
    .array(
      z.enum(PRODUCT_FEATURES, {
        message: "Wybierz prawidłową cechę produktu.",
      }),
    )
    .min(1, "Wybierz co najmniej jedną cechę produktu."),
});

const productPriceObject = z.object({
  netPrice: priceAmountSchema(
    "Podaj prawidłową cenę netto.",
    "Cena netto nie może być ujemna.",
  ),
  grossPrice: priceAmountSchema(
    "Podaj prawidłową cenę brutto.",
    "Cena brutto nie może być ujemna.",
  ),
  vatRate: z.literal(PRODUCT_VAT_RATES, "Wybierz prawidłową stawkę VAT."),
  currency: z.enum(PRODUCT_CURRENCIES, {
    message: "Wybierz prawidłową walutę.",
  }),
});

function validatePriceConsistency(
  data: z.infer<typeof productPriceObject>,
  ctx: z.RefinementCtx,
) {
  const expectedGrossPrice = roundToDecimals(
    data.netPrice * (1 + data.vatRate / 100),
    PRICE_DECIMALS,
  );
  const actualGrossPrice = roundToDecimals(data.grossPrice, PRICE_DECIMALS);

  if (Math.abs(actualGrossPrice - expectedGrossPrice) > PRICE_TOLERANCE) {
    ctx.addIssue({
      code: "custom",
      path: ["grossPrice"],
      message: "Cena brutto nie odpowiada cenie netto i stawce VAT.",
    });
  }
}

export const productPriceSchema = productPriceObject.superRefine(
  validatePriceConsistency,
);

const orderQuantityObject = z.object({
  minOrderQuantity: numberField({
    invalid: "Podaj prawidłową minimalną ilość na koszyk.",
    integer: "Minimalna ilość na koszyk musi być liczbą całkowitą.",
    nonnegative: "Minimalna ilość na koszyk nie może być ujemna.",
  }),
  maxOrderQuantity: numberField({
    invalid: "Podaj prawidłową maksymalną ilość na koszyk.",
    integer: "Maksymalna ilość na koszyk musi być liczbą całkowitą.",
    nonnegative: "Maksymalna ilość na koszyk nie może być ujemna.",
  }),
});

const stockQuantitySchema = z.discriminatedUnion("isLimited", [
  z.object({
    isLimited: z.literal(true),
    stockQuantity: optionalNumberField({
      invalid: "Podaj prawidłową ilość na magazynie.",
      integer: "Ilość na magazynie musi być liczbą całkowitą.",
      nonnegative: "Ilość na magazynie nie może być ujemna.",
    }),
  }),
  z.object({
    isLimited: z.literal(false),
  }),
]);

const productAvailabilityObject = z
  .object({ isAvailable: z.boolean() })
  .and(orderQuantityObject)
  .and(stockQuantitySchema);

function validateOrderQuantities(
  data: z.infer<typeof orderQuantityObject>,
  ctx: z.RefinementCtx,
) {
  if (data.minOrderQuantity > data.maxOrderQuantity) {
    ctx.addIssue({
      code: "custom",
      path: ["minOrderQuantity"],
      message: "Minimalna ilość na koszyk nie może przekraczać maksymalnej.",
    });
  }
}

export const productAvailabilitySchema = productAvailabilityObject.superRefine(
  validateOrderQuantities,
);

export const productSchema = productBasicInfoSchema
  .and(productPriceSchema)
  .and(productAvailabilitySchema)
  .and(
    z.object({
      id: z.string().trim().min(1, "Identyfikator produktu jest wymagany."),
    }),
  );

export type ProductBasicInfo = z.infer<typeof productBasicInfoSchema>;
export type ProductPrice = z.infer<typeof productPriceSchema>;
export type ProductAvailability = z.infer<typeof productAvailabilitySchema>;
export type Product = z.infer<typeof productSchema>;
