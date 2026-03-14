import { Component, inject, OnInit } from '@angular/core';
import { SigninForm } from '../../components/signin-form/signin-form';
import { SigninRequest } from '../../../../shared/models/auth';
import { injectDispatch } from '@ngrx/signals/events';
import { authPageEvents } from '../../store/auth.events';
import { AuthStore } from '../../store/auth.store';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  imports: [SigninForm, MatCardModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin implements OnInit {
  protected readonly store = inject(AuthStore);
  protected readonly dispatch = injectDispatch(authPageEvents);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('signup') === 'success') {
      this.snackBar.open('Your sign up was successful, you can sign in now.', 'Close', {
        duration: 3500,
      });
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { signup: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  handleSigninComplete(credentials: SigninRequest) {
    this.dispatch.signinSubmitted(credentials);
  }
}
