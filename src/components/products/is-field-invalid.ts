import type { AnyFieldApi } from "@tanstack/react-form";

// Single source of truth for error display in product step forms.
// Spec requires live validation, so validators run on change/blur/submit.
// Display follows the framework's touch lifecycle: TanStack touches the
// edited field during change/blur validation and all fields on submit, so
// errors appear live where the user works and reveal everywhere after a
// failed submit — never all-red from a single keystroke, never a dead
// submit button. Deliberately no submissionAttempts clause: it never
// resets and would keep every field red forever after one failed submit.
export function isFieldInvalid(field: AnyFieldApi): boolean {
  const { isTouched, isValid } = field.state.meta;

  return !isValid && isTouched;
}
