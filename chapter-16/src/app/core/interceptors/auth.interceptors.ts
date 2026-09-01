import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Dispatcher } from '@ngrx/signals/events';
import { authApiEvents } from '../../features/auth/store/auth.events';
import { AuthResponse } from '../../shared/models/auth';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

function buildAuthHeaders(tokenService: TokenService): Record<string, string> {
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
  const dispatcher = inject(Dispatcher);
  const http = inject(HttpClient);

  const skipAuthHeaders =
    req.url.includes('/users/signin') ||
    req.url.includes('/users/signup') ||
    req.url.includes('/users/refresh-token');

  const skipRefreshOn401 = skipAuthHeaders || req.url.includes('/users/logout');

  if (skipAuthHeaders) {
    return next(req);
  }

  const authReq = req.clone({ setHeaders: buildAuthHeaders(tokenService) });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || skipRefreshOn401) {
        return throwError(() => error);
      }

      const retryWith = (token: string) =>
        next(req.clone({ setHeaders: buildAuthHeaders(tokenService) }));

      if (isRefreshing) {
        return refreshedToken$.pipe(
          filter((token): token is string => token !== null),
          take(1),
          switchMap(retryWith),
        );
      }

      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        dispatcher.dispatch(
          authApiEvents.tokenRefreshFailure({ error: 'No refresh token available' }),
        );
        return throwError(() => error);
      }

      isRefreshing = true;
      refreshedToken$.next(null);

      return http
        .post<AuthResponse>(`${environment.apiUrl}/user/api/users/refresh-token`, { refreshToken })
        .pipe(
          switchMap((response) => {
            isRefreshing = false;
            dispatcher.dispatch(
              authApiEvents.tokenRefreshSuccess({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              }),
            );
            refreshedToken$.next(response.accessToken);
            return retryWith(response.accessToken);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            dispatcher.dispatch(
              authApiEvents.tokenRefreshFailure({ error: 'Token refresh failed' }),
            );
            return throwError(() => refreshError);
          }),
        );
    }),
  );
};
