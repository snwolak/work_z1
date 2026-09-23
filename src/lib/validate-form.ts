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
