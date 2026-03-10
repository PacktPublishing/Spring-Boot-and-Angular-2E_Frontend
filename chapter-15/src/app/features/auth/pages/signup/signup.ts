import { Component, inject } from '@angular/core';
import { SignupForm } from '../../components/signup-form/signup-form';
import { SignupRequest } from '../../../../shared/models/auth';
import { injectDispatch } from '@ngrx/signals/events';
import { authPageEvents } from '../../store/auth.events';
import { AuthStore } from '../../store/auth.store';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signup',
  imports: [SignupForm, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  protected readonly store = inject(AuthStore);
  protected readonly dispatch = injectDispatch(authPageEvents);

  handleSignupComplete(data: SignupRequest) {
    this.dispatch.signupSubmitted(data);
  }
}
