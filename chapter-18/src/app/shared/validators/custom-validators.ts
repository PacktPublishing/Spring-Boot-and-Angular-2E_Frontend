import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) return null;
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { noNumbers: { value: control.value } } : null;
  };
}

export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
