import { Component, inject } from '@angular/core';
import { SigninForm } from '../../components/signin-form/signin-form';
import { SigninRequest } from '../../../../shared/models/auth';
import { injectDispatch } from '@ngrx/signals/events';
import { authPageEvents } from '../../store/auth.events';
import { AuthStore } from '../../store/auth.store';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signin',
  imports: [SigninForm, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin {
  protected readonly store = inject(AuthStore);
  protected readonly dispatch = injectDispatch(authPageEvents);

  handleSigninComplete(credentials: SigninRequest) {
    this.dispatch.signinSubmitted(credentials);
  }
}
