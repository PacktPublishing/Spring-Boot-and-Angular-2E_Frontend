import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SignupRequest } from '../../../../shared/models/auth';
import {
  noNumbersValidator,
  passwordMatchValidator,
} from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-signup-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
  private fb = inject(FormBuilder);

  serverError = input<string | null>(null);

  signupComplete = output<SignupRequest>();

  signupForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, noNumbersValidator()]],
    lastName: ['', [Validators.required, noNumbersValidator()]],
    email: ['', [Validators.required, Validators.email]],
    passwords: this.fb.group(
      {
        password: this.fb.nonNullable.control('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
        ]),
        confirmPassword: this.fb.nonNullable.control('', [Validators.required]),
      },
      { validators: [passwordMatchValidator()] },
    ),
    phone: [''],
    address: [''],
    city: [''],
    state: [''],
    zipCode: [''],
    country: [''],
    agreeToTerms: [false, [Validators.requiredTrue]],
  });

  // Signal-based form validity tracking
  readonly isFormValid = toSignal(
    this.signupForm.statusChanges.pipe(map((status) => status === 'VALID')),
    { initialValue: this.signupForm.valid },
  );

  // Password visibility toggles
  hidePassword = true;
  hideConfirmPassword = true;

  // Getter for the passwords group
  get passwordsGroup() {
    return this.signupForm.get('passwords') as FormGroup;
  }

  getErrorMessage(controlName: string, groupName?: string): string {
    const control = groupName
      ? this.signupForm.get(groupName)?.get(controlName)
      : this.signupForm.get(controlName);

    if (!control || !control.errors || !control.touched) return '';

    if (control.hasError('required')) return `${this.formatFieldName(controlName)} is required.`;
    if (control.hasError('email')) return 'Please enter a valid email address.';
    if (control.hasError('minlength')) {
      const err = control.getError('minlength');
      return `Must be at least ${err.requiredLength} characters.`;
    }
    if (control.hasError('noNumbers'))
      return `${this.formatFieldName(controlName)} must not contain numbers.`;
    if (control.hasError('pattern')) return 'Must include uppercase, lowercase, and a number.';

    return 'Invalid value.';
  }

  getGroupErrorMessage(groupName: string): string {
    const group = this.signupForm.get(groupName);
    if (!group || !group.errors) return '';
    if (group.hasError('passwordMismatch')) return 'Passwords do not match.';
    return '';
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const form = this.signupForm.getRawValue();
      const signupData: SignupRequest = {
        email: form.email,
        password: form.passwords.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zipCode: form.zipCode || undefined,
        country: form.country || undefined,
      };
      this.signupComplete.emit(signupData);
    }
  }

  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }
}
