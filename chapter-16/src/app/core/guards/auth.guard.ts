import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../../features/auth/store/auth.store';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (store.isAuthenticated() || !!tokenService.getAccessToken()) {
    return true;
  }

  return router.createUrlTree(['/auth/signin']);
};

export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!store.isAuthenticated() && !tokenService.getAccessToken()) {
    return true;
  }

  return router.createUrlTree(['/books']);
};
