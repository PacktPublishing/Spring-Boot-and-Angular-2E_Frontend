import { HttpInterceptorFn, HttpErrorResponse } from
  '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from
  '../../features/auth/services/auth.service';
import { Dispatcher } from '@ngrx/signals/events';
import { authApiEvents } from
  '../../features/auth/store/auth.events';

function buildAuthHeaders(
  tokenService: TokenService
): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = tokenService.getAccessToken();
  const user = tokenService.getUser();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (user?.keycloakId) {
    headers['X-User-Id'] = user.keycloakId;
  }
  return headers;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const dispatcher = inject(Dispatcher);

  const isAuthEndpoint = req.url.includes('/users/signin')
    || req.url.includes('/users/signup')
    || req.url.includes('/users/refresh-token');

  if (isAuthEndpoint) {
    return next(req);
  }

  const headers = buildAuthHeaders(tokenService);
  const authReq = Object.keys(headers).length > 0
    ? req.clone({ setHeaders: headers })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          dispatcher.dispatch(
            authApiEvents.tokenRefreshFailure({
              error: 'No refresh token available',
            })
          );
          return throwError(() => error);
        }
        return authService.refreshToken(refreshToken).pipe(
          switchMap((tokens) => {
            dispatcher.dispatch(
              authApiEvents.tokenRefreshSuccess(tokens)
            );
            const retryHeaders = buildAuthHeaders(tokenService);
            const retryReq = req.clone({
              setHeaders: retryHeaders,
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            dispatcher.dispatch(
              authApiEvents.tokenRefreshFailure({
                error: 'Token refresh failed',
              })
            );
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
