import { Component, inject, output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { LoginCredentials } from '../../../../shared/models/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);

  // Output event for parent component communication
  loginSubmit = output<LoginCredentials & { rememberMe: boolean }>();
  forgotPassword = output<string>(); // Emit email for forgot password

  // Reactive form with validation
  loginForm = this.fb.group({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true
    }),
    rememberMe: this.fb.control(false, {
      nonNullable: true
    })
  });

  // Signal-based reactive state management
  readonly isFormValid = toSignal(
    this.loginForm.statusChanges.pipe(
      map(status => status === 'VALID')
    ),
    { initialValue: this.loginForm.valid }
  );

  readonly isSubmitting = toSignal(
    this.loginForm.statusChanges.pipe(
      map(() => this.loginForm.disabled)
    ),
    { initialValue: false }
  );

  // Password visibility control
  hidePassword = true;

  // Form submission
  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      const loginData = {
        email: formData.email!,
        password: formData.password!,
        rememberMe: formData.rememberMe!
      };

      this.loginSubmit.emit(loginData);
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  // Forgot password handler
  onForgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (email && this.loginForm.get('email')?.valid) {
      this.forgotPassword.emit(email);
    } else {
      // If no valid email, just emit empty string to trigger forgot password flow
      this.forgotPassword.emit('');
    }
  }

  // Error message helper
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minlength')) {
      const requiredLength = field.getError('minlength').requiredLength;
      return `${this.formatFieldName(fieldName)} must be at least ${requiredLength} characters`;
    }

    return '';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
