import { Component } from '@angular/core';
import { SignupForm } from '../../components/signup-form/signup-form';
import { SignupRequest } from '../../../../shared/models/auth';

@Component({
  selector: 'app-signup',
  imports: [SignupForm],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  handleSignupComplete(signupData: SignupRequest) {
    console.log('Signup data:', signupData);
    // In Chapter 16, this will call AuthStore.signup()
  }
}
