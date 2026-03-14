import { Component, inject, signal, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStore } from '../../../auth/store/auth.store';
import { AuthService } from '../../../auth/services/auth.service';
import { ProfileForm } from '../../components/profile-form/profile-form';
import { UserProfile } from '../../../../shared/models/auth';
import { extractErrorMessage } from '../../../../shared/utils/error-message';

@Component({
  selector: 'app-profile',
  imports: [ProfileForm, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  protected readonly store = inject(AuthStore);

  profileData = signal<UserProfile | null>(null);
  loading = signal(false);
  pageLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    this.pageLoading.set(true);
    this.authService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        this.profileData.set(profile);
        this.pageLoading.set(false);
      },
      error: (err: unknown) => {
        const message = extractErrorMessage(err, 'Failed to load profile');
        this.error.set(message);
        this.pageLoading.set(false);
      },
    });
  }

  handleProfileSubmit(profile: UserProfile) {
    this.loading.set(true);
    this.authService.updateProfile(profile).subscribe({
      next: (updated: UserProfile) => {
        this.profileData.set(updated);
        this.loading.set(false);
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
      },
      error: (err: unknown) => {
        const message = extractErrorMessage(err, 'Failed to update profile');
        this.loading.set(false);
        this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      },
    });
  }
}
