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
  PRODUCT_CATEGORY_ITEMS,
  PRODUCT_FEATURES,
  PRODUCT_FEATURE_LABELS,
  PRODUCT_MANUFACTURER_ITEMS,
  isProductCategory,
  isProductFeature,
  isProductManufacturer,
  productBasicInfoSchema,
  type ProductBasicInfo,
  type ProductCategory,
  type ProductFeature,
  type ProductManufacturer,
} from "@/lib/product";
import { stepFormValidators, submitStepForm } from "@/lib/validate-form";
import { isFieldInvalid } from "@/components/products/is-field-invalid";

export const PRODUCT_BASIC_INFO_FORM_ID = "product-basic-info-form";

type ProductBasicInfoFormValues = Omit<
  ProductBasicInfo,
  "manufacturer" | "category"
> & {
  manufacturer: ProductManufacturer | "";
  category: ProductCategory | "";
};

const defaultValues: ProductBasicInfoFormValues = {
  name: "",
  sku: "",
  description: "",
  manufacturer: "",
  category: "",
  features: [],
};

type ProductBasicInfoFormProps = {
  onSubmit: (value: ProductBasicInfo) => void;
};

export function ProductBasicInfoForm({ onSubmit }: ProductBasicInfoFormProps) {
  const form = useForm({
    defaultValues,
    validators: stepFormValidators<ProductBasicInfoFormValues>(
      productBasicInfoSchema,
    ),
    onSubmit: ({ value }) => {
      submitStepForm(productBasicInfoSchema, value, onSubmit);
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
              const isInvalid = isFieldInvalid(field);

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
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                      // Keep per-cause error keys fresh; stale keys linger until blur.
                      field.handleBlur();
                    }}
                  />
                  <FieldError
                    errors={isInvalid ? field.state.meta.errors : []}
                  />
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="sku">
            {(field) => {
              const isInvalid = isFieldInvalid(field);

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
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                      // Keep per-cause error keys fresh; stale keys linger until blur.
                      field.handleBlur();
                    }}
                  />
                  <FieldError
                    errors={isInvalid ? field.state.meta.errors : []}
                  />
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field) => {
            const isInvalid = isFieldInvalid(field);

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Opis produktu</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder="Krótki opis produktu"
                  className="min-h-16"
                  aria-invalid={isInvalid}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    // Keep per-cause error keys fresh; stale keys linger until blur.
                    field.handleBlur();
                  }}
                />
                <FieldError errors={isInvalid ? field.state.meta.errors : []} />
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="manufacturer">
            {(field) => {
              const isInvalid = isFieldInvalid(field);

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Producent</FieldLabel>
                  <Select
                    items={PRODUCT_MANUFACTURER_ITEMS}
                    value={field.state.value || null}
                    onValueChange={(value) => {
                      if (isProductManufacturer(value)) {
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
                      <SelectValue placeholder="Wybierz producenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_MANUFACTURER_ITEMS.map((item) => (
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

          <form.Field name="category">
            {(field) => {
              const isInvalid = isFieldInvalid(field);

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Kategoria</FieldLabel>
                  <Select
                    items={PRODUCT_CATEGORY_ITEMS}
                    value={field.state.value || null}
                    onValueChange={(value) => {
                      if (isProductCategory(value)) {
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
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORY_ITEMS.map((item) => (
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

        <form.Field name="features">
          {(field) => {
            const isInvalid = isFieldInvalid(field);

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Cechy produktu</FieldLabel>
                <ToggleGroup
                  multiple
                  variant="outline"
                  value={field.state.value}
                  className="flex-wrap"
                  onBlur={field.handleBlur}
                  onValueChange={(selected) => {
                    field.handleChange(
                      selected.filter((feature): feature is ProductFeature =>
                        isProductFeature(feature),
                      ),
                    );
                    // Discrete choice: revalidate now, don't wait for blur.
                    field.handleBlur();
                  }}
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
                <FieldError errors={isInvalid ? field.state.meta.errors : []} />
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
}
