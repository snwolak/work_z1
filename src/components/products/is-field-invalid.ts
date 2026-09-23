// Single source of truth for error display in product step forms.
// Spec requires live validation, so validators run on change/blur/submit.
// Display follows the framework's touch lifecycle: TanStack touches the
// edited field during change/blur validation and all fields on submit, so
// errors appear live where the user works and reveal everywhere after a
// failed submit — never all-red from a single keystroke, never a dead
// submit button. Deliberately no submissionAttempts clause: it never
// resets and would keep every field red forever after one failed submit.
// Structural param (not AnyFieldApi): full field types carry array-only
// helpers typed with `never` that break assignability.
export function isFieldInvalid(field: {
  readonly state: {
    readonly meta: {
      readonly isTouched: boolean;
      readonly isValid: boolean;
    };
  };
}): boolean {
  const { isTouched, isValid } = field.state.meta;

  return !isValid && isTouched;
}
