import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { SignupData } from '../../../../shared/models/auth';
import { Router } from 'express';
import { RouterModule } from '@angular/router';

// Custom validator functions
function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) return null;
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { noNumbers: { value: control.value } } : null;
  };
}

function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

function minimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl<Date>): ValidationErrors | null => {
    if (!control.value) return null;
    const today = new Date();
    const birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : { minimumAge: { requiredAge: minAge, actualAge: age } };
  };
}

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatChipsModule,
    RouterModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  private fb = inject(FormBuilder);

  // Output event for parent component communication
  signupComplete = output<SignupData>();

  // Complex reactive form with nested groups and arrays
  signupForm = this.fb.group({
    firstName: this.fb.control('', {
      validators: [Validators.required, noNumbersValidator()],
      nonNullable: true
    }),
    lastName: this.fb.control('', {
      validators: [Validators.required, noNumbersValidator()],
      nonNullable: true
    }),
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    dateOfBirth: this.fb.control<Date | null>(null, {
      validators: [Validators.required, minimumAgeValidator(13)]
    }),
    passwords: this.fb.group({
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)],
        nonNullable: true
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true
      })
    }, { validators: [passwordMatchValidator()] }),
    address: this.fb.group({
      street: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      city: this.fb.control('', {
        validators: [Validators.required, noNumbersValidator()],
        nonNullable: true
      }),
      country: this.fb.control('', {
        validators: [Validators.required, noNumbersValidator()],
        nonNullable: true
      })
    }),
    favoriteGenres: this.fb.array<string>([]),
    agreeToTerms: this.fb.control(false, {
      validators: [Validators.requiredTrue],
      nonNullable: true
    })
  });

  // Signal-based reactive state management
  readonly isFormValid = toSignal(
    this.signupForm.statusChanges.pipe(
      map(status => status === 'VALID')
    ),
    { initialValue: this.signupForm.valid }
  );

  readonly passwordStrength = toSignal(
    this.signupForm.get('passwords.password')!.valueChanges.pipe(
      map(password => this.calculatePasswordStrength(password || ''))
    ),
    { initialValue: 0 }
  );

  // Form group and array accessors
  get passwordsGroup() {
    return this.signupForm.get('passwords');
  }

  get addressGroup() {
    return this.signupForm.get('address');
  }

  get genresArray() {
    return this.signupForm.get('favoriteGenres') as FormArray<FormControl<string>>;
  }

  // Password visibility controls
  hidePassword = true;
  hideConfirmPassword = true;

  // Date constraints
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);

  // Form interaction methods
  addGenre() {
    const newGenreControl = this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true
    });
    this.genresArray.push(newGenreControl);
  }

  removeGenre(index: number) {
    if (this.genresArray.length > 0) {
      this.genresArray.removeAt(index);
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      // Reconstruct the data to match our interface
      const signupData: SignupData = {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        dateOfBirth: formData.dateOfBirth!,
        password: formData.passwords!.password!,
        confirmPassword: formData.passwords!.confirmPassword!,
        address: {
          street: formData.address!.street!,
          city: formData.address!.city!,
          country: formData.address!.country!
        },
        favoriteGenres: formData.favoriteGenres as string[],
        agreeToTerms: formData.agreeToTerms!
      };

      this.signupComplete.emit(signupData);
    }
  }

  // Utility methods
  calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;
    return strength;
  }

  getPasswordStrengthLabel(): string {
    const strength = this.passwordStrength();
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Fair';
    if (strength < 100) return 'Good';
    return 'Strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.passwordStrength();
    if (strength < 40) return 'warn';
    if (strength < 80) return 'accent';
    return 'primary';
  }

  getErrorMessage(fieldName: string, groupName?: string): string {
    const field = groupName
      ? this.signupForm.get(`${groupName}.${fieldName}`)
      : this.signupForm.get(fieldName);

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
    if (field.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    if (field.hasError('noNumbers')) {
      return `${this.formatFieldName(fieldName)} cannot contain numbers`;
    }
    if (field.hasError('minimumAge')) {
      const requiredAge = field.getError('minimumAge').requiredAge;
      return `You must be at least ${requiredAge} years old to register`;
    }

    return '';
  }

  getGroupErrorMessage(groupName: string): string {
    const group = this.signupForm.get(groupName);
    if (!group || !group.touched) return '';

    if (group.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    return '';
  }

  private formatFieldName(fieldName: string): string {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
