import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStore } from '../../features/auth/store/auth.store';
import { AuthService } from '../../features/auth/services/auth.service';
import { Dispatcher } from '@ngrx/signals/events';
import { authApiEvents } from '../../features/auth/store/auth.events';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);
  const authService = inject(AuthService);
  const dispatcher = inject(Dispatcher);
  const token = store.accessToken();

  const isAuthEndpoint =
    req.url.includes('/users/signin') ||
    req.url.includes('/users/signup') ||
    req.url.includes('/users/refresh-token');

  if (!token || isAuthEndpoint) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = store.refreshToken();
        if (!refreshToken) {
          dispatcher.dispatch(
            authApiEvents.tokenRefreshFailure({
              error: 'No refresh token available',
            }),
          );
          return throwError(() => error);
        }
        return authService.refreshToken(refreshToken).pipe(
          switchMap((tokens) => {
            dispatcher.dispatch(authApiEvents.tokenRefreshSuccess(tokens));
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            dispatcher.dispatch(
              authApiEvents.tokenRefreshFailure({
                error: 'Token refresh failed',
              }),
            );
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
