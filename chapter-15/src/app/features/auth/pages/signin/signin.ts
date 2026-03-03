import { Component } from '@angular/core';
import { SigninForm } from '../../components/signin-form/signin-form';
import { SigninRequest } from '../../../../shared/models/auth';

@Component({
  selector: 'auth-signin',
  imports: [SigninForm],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin {
  handleSigninComplete(signinData: SigninRequest) {
    console.log('Signin data:', signinData);
    // In Chapter 16, this will call AuthStore.signin()
  }
}
