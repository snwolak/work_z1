"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRODUCT_CURRENCIES,
  PRODUCT_VAT_RATE_LABELS,
  PRODUCT_VAT_RATES,
  calcGrossPrice,
  calcNetPrice,
  isProductCurrency,
  isProductVatRate,
  parseDecimalInput,
  productPriceSchema,
  type ProductCurrency,
  type ProductPrice,
  type ProductVatRate,
} from "@/lib/product";
import { asFormValidator } from "@/lib/validate-form";

export const PRODUCT_PRICE_FORM_ID = "product-price-form";

type ProductPriceFormValues = {
  netPrice: string;
  grossPrice: string;
  vatRate: ProductVatRate;
  currency: ProductCurrency;
};

const defaultValues: ProductPriceFormValues = {
  netPrice: "",
  grossPrice: "",
  vatRate: 23,
  currency: "PLN",
};

const VAT_ITEMS = PRODUCT_VAT_RATES.map((value) => ({
  value: String(value),
  label: PRODUCT_VAT_RATE_LABELS[value],
}));

const CURRENCY_ITEMS = PRODUCT_CURRENCIES.map((value) => ({
  value,
  label: value,
}));

type ProductPriceFormProps = {
  onSubmit: (value: ProductPrice) => void;
};

export function ProductPriceForm({ onSubmit }: ProductPriceFormProps) {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: asFormValidator<ProductPriceFormValues>(productPriceSchema),
    },
    onSubmit: ({ value }) => {
      const parsed = productPriceSchema.safeParse(value);

      if (parsed.success) {
        onSubmit(parsed.data);
      }
    },
  });
  const lastEditedPrice = useRef<"netPrice" | "grossPrice">("netPrice");

  function handleNetPriceChange(rawNetPrice: string) {
    const vatRate = form.getFieldValue("vatRate");
    lastEditedPrice.current = "netPrice";

    const netPrice = parseDecimalInput(rawNetPrice);

    if (netPrice !== null) {
      form.setFieldValue(
        "grossPrice",
        String(calcGrossPrice(netPrice, vatRate)),
      );
    }
  }

  function handleGrossPriceChange(rawGrossPrice: string) {
    const vatRate = form.getFieldValue("vatRate");
    lastEditedPrice.current = "grossPrice";

    const grossPrice = parseDecimalInput(rawGrossPrice);

    if (grossPrice !== null) {
      form.setFieldValue("netPrice", String(calcNetPrice(grossPrice, vatRate)));
    }
  }

  function handleVatRateChange(selected: string | null) {
    if (!selected) {
      return;
    }

    const vatRate = Number(selected);

    if (!isProductVatRate(vatRate)) {
      return;
    }

    form.setFieldValue("vatRate", vatRate);

    if (lastEditedPrice.current === "grossPrice") {
      const grossPrice = parseDecimalInput(form.getFieldValue("grossPrice"));

      if (grossPrice !== null) {
        form.setFieldValue(
          "netPrice",
          String(calcNetPrice(grossPrice, vatRate)),
        );
      }
    } else {
      const netPrice = parseDecimalInput(form.getFieldValue("netPrice"));

      if (netPrice !== null) {
        form.setFieldValue(
          "grossPrice",
          String(calcGrossPrice(netPrice, vatRate)),
        );
      }
    }
  }

  return (
    <form
      id={PRODUCT_PRICE_FORM_ID}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="netPrice">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Cena netto</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="0.00"
                    inputMode="decimal"
                    className="h-8 rounded-full"
                    aria-invalid={isInvalid}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                      handleNetPriceChange(event.target.value);
                    }}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="grossPrice">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Cena brutto</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="0.00"
                    inputMode="decimal"
                    className="h-8 rounded-full"
                    aria-invalid={isInvalid}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                      handleGrossPriceChange(event.target.value);
                    }}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="vatRate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Stawka VAT</FieldLabel>
                  <Select
                    items={VAT_ITEMS}
                    value={String(field.state.value)}
                    onValueChange={handleVatRateChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="h-8 w-full rounded-full"
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Wybierz stawkę" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_VAT_RATES.map((rate) => (
                        <SelectItem key={rate} value={String(rate)}>
                          {PRODUCT_VAT_RATE_LABELS[rate]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="currency">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Waluta</FieldLabel>
                  <Select
                    items={CURRENCY_ITEMS}
                    value={field.state.value}
                    onValueChange={(value) => {
                      if (isProductCurrency(value)) {
                        field.handleChange(value);
                      }
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="h-8 w-full rounded-full"
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Wybierz walutę" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CURRENCIES.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>
        </div>
      </FieldGroup>
    </form>
  );
}
