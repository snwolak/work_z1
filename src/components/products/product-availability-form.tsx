"use client";

import { useForm } from "@tanstack/react-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { productAvailabilitySchema } from "@/lib/product";
import type { ProductAvailability } from "@/lib/product";

export const PRODUCT_AVAILABILITY_FORM_ID = "product-availability-form";

type ProductAvailabilityFormValues = {
  isAvailable: boolean;
  isLimited: boolean;
  minOrderQuantity: string;
  maxOrderQuantity: string;
};

const defaultValues: ProductAvailabilityFormValues = {
  isAvailable: true,
  isLimited: false,
  minOrderQuantity: "",
  maxOrderQuantity: "",
};

type ProductAvailabilityFormProps = {
  onSubmit: (value: ProductAvailability) => void;
};

export function ProductAvailabilityForm({
  onSubmit,
}: ProductAvailabilityFormProps) {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: productAvailabilitySchema as unknown as never,
    },
    onSubmit: ({ value }) => {
      const parsed = productAvailabilitySchema.safeParse(value);

      if (parsed.success) {
        onSubmit(parsed.data);
      }
    },
  });

  return (
    <form
      id={PRODUCT_AVAILABILITY_FORM_ID}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-4">
        <form.Field name="isAvailable">
          {(field) => (
            <Field orientation="horizontal" className="items-center gap-2">
              <Switch
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
              <FieldLabel htmlFor={field.name} className="flex-1">
                Produkt jest dostępny
              </FieldLabel>
            </Field>
          )}
        </form.Field>

        <Separator className="bg-[#E5E5E5]" />

        <form.Field name="isLimited">
          {(field) => (
            <Field orientation="horizontal" className="items-center gap-2">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
              <FieldLabel htmlFor={field.name} className="flex-1">
                Produkt limitowany
              </FieldLabel>
            </Field>
          )}
        </form.Field>

        <Separator className="bg-[#E5E5E5]" />

        <div className="flex flex-col gap-4">
          <FieldTitle className="text-base leading-6">
            Limity koszyka
          </FieldTitle>

          <div className="grid gap-4 md:grid-cols-2">
            <form.Field name="minOrderQuantity">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Minimalna ilość
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="1"
                      inputMode="numeric"
                      className="h-8 rounded-full"
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="maxOrderQuantity">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Maksymalna ilość
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="10"
                      inputMode="numeric"
                      className="h-8 rounded-full"
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            </form.Field>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}
