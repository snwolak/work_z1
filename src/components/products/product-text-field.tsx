"use client";

import { isFieldInvalid } from "@/components/products/is-field-invalid";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Narrow view of a text-valued TanStack field. Call sites keep
// `<form.Field name="...">` (type inference stays at the usage); this covers
// the repeated text-input wiring: change + immediate blur revalidation,
// label, and touched-gated errors. Deliberately structural (not AnyFieldApi):
// full field types carry array-only helpers typed with `never` that break
// assignability.
export type ProductTextFieldApi = {
  readonly name: string;
  readonly state: {
    readonly value: string | undefined;
    readonly meta: {
      readonly errors: Array<{ message?: string } | undefined>;
      readonly isTouched: boolean;
      readonly isValid: boolean;
    };
  };
  handleChange: (value: string) => void;
  handleBlur: () => void;
};

type ProductTextFieldProps = {
  field: ProductTextFieldApi;
  label: string;
  placeholder?: string | undefined;
  inputMode?: "decimal" | "numeric" | undefined;
  multiline?: boolean | undefined;
  onValueChange?: ((value: string) => void) | undefined;
};

export function ProductTextField({
  field,
  label,
  placeholder,
  inputMode,
  multiline = false,
  onValueChange,
}: ProductTextFieldProps) {
  const isInvalid = isFieldInvalid(field);

  function handleInputChange(value: string): void {
    field.handleChange(value);
    // Keep per-cause error keys fresh; stale keys linger until blur.
    field.handleBlur();
    onValueChange?.(value);
  }

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {multiline ? (
        <Textarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          placeholder={placeholder}
          className="min-h-16"
          aria-invalid={isInvalid}
          onBlur={field.handleBlur}
          onChange={(event) => handleInputChange(event.target.value)}
        />
      ) : (
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          placeholder={placeholder}
          inputMode={inputMode}
          className="h-8 rounded-full"
          aria-invalid={isInvalid}
          onBlur={field.handleBlur}
          onChange={(event) => handleInputChange(event.target.value)}
        />
      )}
      <FieldError errors={isInvalid ? field.state.meta.errors : []} />
    </Field>
  );
}
