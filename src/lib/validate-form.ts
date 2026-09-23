import type { StandardSchemaV1 } from "@tanstack/react-form";
import type { z } from "zod";

// TanStack Form types submit validators as StandardSchemaV1<TFormValues>,
// so the schema's declared input must match the form values. Zod schemas
// built with coercion or preprocessing declare `unknown` inputs even though
// they accept any value at runtime, which makes them unassignable directly.
// This adapter exposes the same `~standard.validate` under the form's input
// type. It is sound because validation input is always `unknown`-compatible
// at runtime, and `types` is omitted (optional in StandardSchemaV1), so no
// type assertion is needed.
export function asFormValidator<TFormValues>(
  schema: StandardSchemaV1<unknown, unknown>,
): StandardSchemaV1<TFormValues, unknown> {
  const standard = schema["~standard"];

  return {
    "~standard": {
      version: 1,
      vendor: standard.vendor,
      validate: standard.validate,
    },
  };
}

// Submit gate for step forms: the schema already ran as the TanStack
// onSubmit validator (field errors are displayed by the form); this returns
// the full safeParse result so callers keep error details instead of
// receiving a swallowed null.
export function parseFormSubmit<Output>(
  schema: {
    safeParse(
      value: unknown,
    ): { success: true; data: Output } | { success: false; error: z.ZodError };
  },
  value: unknown,
): { success: true; data: Output } | { success: false; error: z.ZodError } {
  return schema.safeParse(value);
}

type StepFormSchema<Output> = StandardSchemaV1<unknown, unknown> & {
  safeParse(
    value: unknown,
  ): { success: true; data: Output } | { success: false; error: z.ZodError };
};

// Single source of truth for step-form wiring: live validation
// ("na bieżąco") runs on every change/blur, display stays gated by
// isFieldInvalid (touched). Replaces the per-form triple
// asFormValidator onChange/onBlur/onSubmit repetition.
export function stepFormValidators<TFormValues>(
  schema: StandardSchemaV1<unknown, unknown>,
): {
  onChange: StandardSchemaV1<TFormValues, unknown>;
  onBlur: StandardSchemaV1<TFormValues, unknown>;
  onSubmit: StandardSchemaV1<TFormValues, unknown>;
} {
  return {
    onChange: asFormValidator<TFormValues>(schema),
    onBlur: asFormValidator<TFormValues>(schema),
    onSubmit: asFormValidator<TFormValues>(schema),
  };
}

// Single submit handler for step forms: safeParse the values and forward
// typed data only on success. Replaces the per-form parseFormSubmit +
// success-check repetition.
export function submitStepForm<Output>(
  schema: StepFormSchema<Output>,
  value: unknown,
  onSubmit: (data: Output) => void,
): void {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    return;
  }

  onSubmit(parsed.data);
}
