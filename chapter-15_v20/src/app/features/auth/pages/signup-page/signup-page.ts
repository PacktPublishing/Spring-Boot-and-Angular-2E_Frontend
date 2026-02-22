import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Signup } from '../../components/signup/signup';
import { SignupData } from '../../../../shared/models/auth';

@Component({
  selector: 'app-signup-page',
  imports: [Signup],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss'
})
export class SignupPage {
  constructor(private router: Router) {}

  handleSignupComplete(signupData: SignupData) {
    console.log('Signup completed with data:', signupData);

    // For now, simulate successful registration and navigate
    setTimeout(() => {
      console.log('Simulating successful registration...');
      this.router.navigate(['/auth/login'], {
        queryParams: { message: 'Registration successful! Please sign in.' }
      });
    }, 1000);
  }
}
