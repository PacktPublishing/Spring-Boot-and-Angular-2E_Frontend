import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Login } from '../../components/login/login';
import { LoginCredentials } from '../../../../shared/models/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [Login, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  registrationMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Check for registration success message
    this.route.queryParams.subscribe(params => {
      this.registrationMessage = params['message'] || null;
    });
  }

  handleLoginAttempt(credentials: LoginCredentials & { rememberMe: boolean }) {
    console.log('Login attempt with credentials:', credentials);

    // For now, simulate successful login
    setTimeout(() => {
      console.log('Simulating successful login...');
      if (credentials.rememberMe) {
        console.log('Remember me option was selected');
        // Here you would typically store login state in localStorage or a persistent store
      }
      this.router.navigate(['/books']);
    }, 1000);
  }

  handleForgotPassword(email: string) {
    console.log('Forgot password requested for email:', email);

    if (email) {
      // If email is provided, show success message
      alert(`Password reset instructions will be sent to ${email}`);
    } else {
      // If no email, prompt for email
      const userEmail = prompt('Please enter your email address for password reset:');
      if (userEmail) {
        alert(`Password reset instructions will be sent to ${userEmail}`);
      }
    }
  }
}
