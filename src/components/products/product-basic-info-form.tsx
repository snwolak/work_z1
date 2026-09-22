"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_FEATURES,
  PRODUCT_FEATURE_LABELS,
  PRODUCT_MANUFACTURERS,
  PRODUCT_MANUFACTURER_LABELS,
  productBasicInfoSchema,
  type ProductBasicInfo,
  type ProductFeature,
} from "@/lib/product";

export const PRODUCT_BASIC_INFO_FORM_ID = "product-basic-info-form";

const defaultValues: ProductBasicInfo = {
  name: "",
  sku: "",
  description: "",
  manufacturer: "" as ProductBasicInfo["manufacturer"],
  category: "" as ProductBasicInfo["category"],
  features: [],
};

type ProductBasicInfoFormProps = {
  onSubmit: (value: ProductBasicInfo) => void;
};

export function ProductBasicInfoForm({ onSubmit }: ProductBasicInfoFormProps) {
  const form = useForm({
    defaultValues,
    validators: { onSubmit: productBasicInfoSchema },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      id={PRODUCT_BASIC_INFO_FORM_ID}
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
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Nazwa produktu</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="np. MacBook Pro 14"
                    className="h-8 rounded-full"
                    aria-invalid={isInvalid}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="sku">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>SKU produktu</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="np. MBP14M3PRO"
                    className="h-8 rounded-full"
                    aria-invalid={isInvalid}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Opis produktu</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                placeholder="Krótki opis produktu"
                className="min-h-16"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="manufacturer">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Producent</FieldLabel>
                  <Select
                    value={field.state.value || null}
                    onValueChange={(value) => {
                      if (value) field.handleChange(value);
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="h-8 w-full rounded-full"
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Wybierz producenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_MANUFACTURERS.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {PRODUCT_MANUFACTURER_LABELS[manufacturer]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="category">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Kategoria</FieldLabel>
                  <Select
                    value={field.state.value || null}
                    onValueChange={(value) => {
                      if (value) field.handleChange(value);
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      className="h-8 w-full rounded-full"
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                    >
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {PRODUCT_CATEGORY_LABELS[category]}
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

        <form.Field name="features">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Cechy produktu</FieldLabel>
                <ToggleGroup
                  multiple
                  variant="outline"
                  value={field.state.value}
                  className="flex-wrap"
                  onValueChange={(value) =>
                    field.handleChange(value as ProductFeature[])
                  }
                >
                  {PRODUCT_FEATURES.map((feature) => (
                    <ToggleGroupItem
                      key={feature}
                      value={feature}
                      className="h-6 rounded-full px-2 text-sm font-normal text-muted-foreground"
                    >
                      {PRODUCT_FEATURE_LABELS[feature]}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
}
