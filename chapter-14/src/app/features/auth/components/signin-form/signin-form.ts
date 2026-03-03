import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { SigninRequest } from '../../../../shared/models/auth';

@Component({
  selector: 'signin-form',
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
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.scss',
})
export class SigninForm {
  private fb = inject(FormBuilder);

  signinComplete = output<SigninRequest>();

  signinForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  readonly isFormValid = toSignal(
    this.signinForm.statusChanges.pipe(map((status) => status === 'VALID')),
    { initialValue: this.signinForm.valid },
  );

  hidePassword = true;

  getErrorMessage(controlName: string): string {
    const control = this.signinForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';
    if (control.hasError('required')) return `${this.formatFieldName(controlName)} is required.`;
    if (control.hasError('email')) return 'Please enter a valid email address.';
    return 'Invalid value.';
  }

  onSubmit() {
    if (this.signinForm.valid) {
      const form = this.signinForm.getRawValue();
      this.signinComplete.emit({
        email: form.email,
        password: form.password,
      });
    }
  }

  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }
}
