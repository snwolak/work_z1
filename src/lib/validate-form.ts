import type { z } from "zod";

// TanStack Form types submit validators as StandardSchemaV1<TFormValues>,
// so the schema's declared input must match the form values. Zod schemas
// built with coercion or preprocessing declare `unknown` inputs even though
// they accept any value at runtime, which makes them unassignable directly.
// This adapter re-declares the input type for validator position only; it is
// sound because validation input is always `unknown`-compatible at runtime.
export function asFormValidator<TFormValues>(
  schema: z.ZodType<unknown, unknown>,
): z.ZodType<unknown, TFormValues> {
  return schema as z.ZodType<unknown, TFormValues>;
}
