import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup-page/signup-page').then(m => m.SignupPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
