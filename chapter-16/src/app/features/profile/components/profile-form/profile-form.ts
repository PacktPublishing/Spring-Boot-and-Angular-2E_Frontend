import { Component, inject, input, output, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map } from 'rxjs';
import { UserProfile } from '../../../../shared/models/auth';

@Component({
  selector: 'app-profile-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
})
export class ProfileForm {
  private fb = inject(FormBuilder);
  profileData = input<UserProfile | null>(null);
  loading = input<boolean>(false);
  profileSubmit = output<UserProfile>();

  profileForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: [''],
    address: [''],
    city: [''],
    state: [''],
    zipCode: [''],
    country: [''],
  });

  readonly isFormValid = toSignal(
    this.profileForm.statusChanges.pipe(map((status) => status === 'VALID')),
    { initialValue: this.profileForm.valid },
  );

  constructor() {
    effect(() => {
      const data = this.profileData();
      if (data) {
        this.profileForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          zipCode: data.zipCode ?? '',
          country: data.country ?? '',
        });
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';
    if (control.hasError('required')) return `${this.formatFieldName(controlName)} is required.`;
    return 'Invalid value.';
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const form = this.profileForm.getRawValue();
      const profileData: UserProfile = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zipCode: form.zipCode || undefined,
        country: form.country || undefined,
      };
      this.profileSubmit.emit(profileData);
    }
  }

  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }
}
