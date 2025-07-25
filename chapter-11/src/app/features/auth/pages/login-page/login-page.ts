import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Login } from '../../components/login/login';
import { LoginCredentials } from '../../../../shared/models/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [Login],
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

  handleLoginAttempt(credentials: LoginCredentials) {
    console.log('Login attempt with credentials:', credentials);

    // For now, simulate successful login
    setTimeout(() => {
      console.log('Simulating successful login...');
      this.router.navigate(['/books']);
    }, 1000);
  }
}
