"use client";

import { useForm } from "@tanstack/react-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ProductTextField } from "@/components/products/product-text-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRODUCT_CURRENCY_ITEMS,
  PRODUCT_VAT_RATE_ITEMS,
  isProductCurrency,
  isProductVatRate,
  productPriceSchema,
  type ProductCurrency,
  type ProductPrice,
  type ProductVatRate,
} from "@/lib/product";
import { stepFormValidators, submitStepForm } from "@/lib/validate-form";
import { isFieldInvalid } from "@/components/products/is-field-invalid";
import { useProductPriceSync } from "@/components/products/use-product-price-sync";

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

type ProductPriceFormProps = {
  onSubmit: (value: ProductPrice) => void;
};

export function ProductPriceForm({ onSubmit }: ProductPriceFormProps) {
  const form = useForm({
    defaultValues,
    validators: stepFormValidators<ProductPriceFormValues>(productPriceSchema),
    onSubmit: ({ value }) => {
      submitStepForm(productPriceSchema, value, onSubmit);
    },
  });
  const priceSync = useProductPriceSync();

  function handleNetPriceChange(rawNetPrice: string): void {
    const vatRate = form.getFieldValue("vatRate");
    const peer = priceSync.onNetPriceChange(rawNetPrice, vatRate);

    if (peer !== null) {
      form.setFieldValue("grossPrice", peer);
    }
  }

  function handleGrossPriceChange(rawGrossPrice: string): void {
    const vatRate = form.getFieldValue("vatRate");
    const peer = priceSync.onGrossPriceChange(rawGrossPrice, vatRate);

    if (peer !== null) {
      form.setFieldValue("netPrice", peer);
    }
  }

  function handleVatRateChange(selected: string | null): void {
    if (!selected) {
      return;
    }

    const vatRate = Number(selected);

    if (!isProductVatRate(vatRate)) {
      return;
    }

    form.setFieldValue("vatRate", vatRate);

    const update = priceSync.onVatRateChange({
      netRaw: form.getFieldValue("netPrice"),
      grossRaw: form.getFieldValue("grossPrice"),
      vatRate,
    });

    if (update) {
      form.setFieldValue(update.name, update.value);
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
            {(field) => (
              <ProductTextField
                field={field}
                label="Cena netto"
                placeholder="0.00"
                inputMode="decimal"
                onValueChange={handleNetPriceChange}
              />
            )}
          </form.Field>

          <form.Field name="grossPrice">
            {(field) => (
              <ProductTextField
                field={field}
                label="Cena brutto"
                placeholder="0.00"
                inputMode="decimal"
                onValueChange={handleGrossPriceChange}
              />
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="vatRate">
            {(field) => {
              const isInvalid = isFieldInvalid(field);

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Stawka VAT</FieldLabel>
                  <Select
                    items={PRODUCT_VAT_RATE_ITEMS}
                    value={String(field.state.value)}
                    onValueChange={(selected) => {
                      handleVatRateChange(selected);
                      // Discrete choice: revalidate now, don't wait for blur.
                      field.handleBlur();
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
                      {PRODUCT_VAT_RATE_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={isInvalid ? field.state.meta.errors : []}
                  />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="currency">
            {(field) => {
              const isInvalid = isFieldInvalid(field);

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Waluta</FieldLabel>
                  <Select
                    items={PRODUCT_CURRENCY_ITEMS}
                    value={field.state.value}
                    onValueChange={(value) => {
                      if (isProductCurrency(value)) {
                        field.handleChange(value);
                        // Discrete choice: revalidate now, don't wait for blur.
                        field.handleBlur();
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
                      {PRODUCT_CURRENCY_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={isInvalid ? field.state.meta.errors : []}
                  />
                </Field>
              );
            }}
          </form.Field>
        </div>
      </FieldGroup>
    </form>
  );
}
