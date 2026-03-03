import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signin',
    loadComponent: () => import('./pages/signin/signin').then((m) => m.Signin),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
];
