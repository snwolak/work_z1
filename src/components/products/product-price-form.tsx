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
  productPriceSchema,
  type ProductCurrency,
  type ProductPrice,
  type ProductVatRate,
} from "@/lib/product";

export const PRODUCT_PRICE_FORM_ID = "product-price-form";

const defaultValues = {
  netPrice: "",
  grossPrice: "",
  vatRate: 23 as ProductPrice["vatRate"],
  currency: "PLN" as ProductCurrency,
};

const VAT_ITEMS = PRODUCT_VAT_RATES.map((value) => ({
  value: String(value),
  label: PRODUCT_VAT_RATE_LABELS[value],
}));

const CURRENCY_ITEMS = PRODUCT_CURRENCIES.map((value) => ({
  value,
  label: value,
}));

const PRICE_DECIMALS = 2;

function roundAmount(value: number) {
  const factor = 10 ** PRICE_DECIMALS;

  return Math.round(value * factor) / factor;
}

function parseAmount(value: string) {
  const trimmed = value.trim();
  const parsed = Number(trimmed.replace(",", "."));

  return trimmed === "" || Number.isNaN(parsed) ? null : parsed;
}

type ProductPriceFormProps = {
  onSubmit: () => void;
};

export function ProductPriceForm({ onSubmit }: ProductPriceFormProps) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: productPriceSchema as unknown as never },
    onSubmit: () => {
      onSubmit();
    },
  });
  const lastEdited = useRef<"netPrice" | "grossPrice">("netPrice");

  function recalcGross(rawNet: string, vat: number) {
    const net = parseAmount(rawNet);

    if (net === null) {
      return;
    }

    form.setFieldValue(
      "grossPrice",
      String(roundAmount(net * (1 + vat / 100))),
    );
  }

  function recalcNet(rawGross: string, vat: number) {
    const gross = parseAmount(rawGross);

    if (gross === null) {
      return;
    }

    form.setFieldValue(
      "netPrice",
      String(roundAmount(gross / (1 + vat / 100))),
    );
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
                      const vat = form.getFieldValue("vatRate");
                      lastEdited.current = "netPrice";
                      field.handleChange(event.target.value);
                      recalcGross(event.target.value, vat);
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
                      const vat = form.getFieldValue("vatRate");
                      lastEdited.current = "grossPrice";
                      field.handleChange(event.target.value);
                      recalcNet(event.target.value, vat);
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
                    onValueChange={(value) => {
                      if (!value) {
                        return;
                      }

                      const rate = Number(value) as ProductVatRate;
                      field.handleChange(rate);

                      if (lastEdited.current === "grossPrice") {
                        recalcNet(form.getFieldValue("grossPrice"), rate);
                      } else {
                        recalcGross(form.getFieldValue("netPrice"), rate);
                      }
                    }}
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
                      if (value) {
                        field.handleChange(value as ProductCurrency);
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
