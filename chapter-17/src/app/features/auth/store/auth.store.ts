import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { Router } from '@angular/router';
import { exhaustMap, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authPageEvents, authApiEvents } from './auth.events';
import { initialAuthState } from './auth.state';
import { withEventHandlers, on, Events, withReducer } from '@ngrx/signals/events';
import { TokenService } from '../../../core/services/token.service';
import { normalizeApiErrorMessage } from '../../../shared/utils/error-message';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  // Initialize state
  withState(initialAuthState),

  // Reducers handle state changes
  withReducer(
    on(authPageEvents.signinSubmitted, () => ({
      loading: true,
      error: null,
    })),

    on(authApiEvents.signinSuccess, (event) => ({
      user: event.payload.user,
      accessToken: event.payload.accessToken,
      refreshToken: event.payload.refreshToken,
      loading: false,
      error: null,
    })),

    on(authApiEvents.signinFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    on(authPageEvents.signupSubmitted, () => ({
      loading: true,
      error: null,
    })),

    on(authApiEvents.signupSuccess, () => ({
      loading: false,
      error: null,
    })),

    on(authApiEvents.signupFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    on(authPageEvents.logoutClicked, () => ({
      loading: true,
      error: null,
    })),

    on(authApiEvents.logoutSuccess, () => ({
      ...initialAuthState,
    })),

    on(authApiEvents.logoutFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    on(authApiEvents.tokenRefreshSuccess, (event) => ({
      accessToken: event.payload.accessToken,
      refreshToken: event.payload.refreshToken,
    })),

    on(authApiEvents.tokenRefreshFailure, () => ({
      ...initialAuthState,
    })),
  ),

  // Computed signals for derived state
  withComputed((store) => ({
    isAuthenticated: computed(() => store.accessToken() !== null),
    currentUser: computed(() => store.user()),
    userDisplayName: computed(() => {
      const user = store.user();
      return user ? `${user.firstName} ${user.lastName}` : '';
    }),
  })),

  // Effects handle async operations
  withEventHandlers(
    (
      store,
      events = inject(Events),
      authService = inject(AuthService),
      router = inject(Router),
      tokenService = inject(TokenService),
    ) => ({
      signin$: events.on(authPageEvents.signinSubmitted).pipe(
        exhaustMap((event) =>
          authService.signin(event.payload).pipe(
            map((response) => authApiEvents.signinSuccess(response)),
            catchError((error: unknown) =>
              of(
                authApiEvents.signinFailure({
                  error: normalizeApiErrorMessage(error, 'Unable to sign in. Please try again.'),
                }),
              ),
            ),
          ),
        ),
      ),

      signup$: events.on(authPageEvents.signupSubmitted).pipe(
        exhaustMap((event) =>
          authService.signup(event.payload).pipe(
            map(() => authApiEvents.signupSuccess()),
            catchError((error: unknown) =>
              of(
                authApiEvents.signupFailure({
                  error: normalizeApiErrorMessage(
                    error,
                    'Unable to create your account right now.',
                  ),
                }),
              ),
            ),
          ),
        ),
      ),

      logout$: events.on(authPageEvents.logoutClicked).pipe(
        exhaustMap(() =>
          tokenService.getAccessToken()
            ? authService.logout().pipe(
                map(() => authApiEvents.logoutSuccess()),
                catchError((error: unknown) =>
                  of(
                    authApiEvents.logoutFailure({
                      error: normalizeApiErrorMessage(error, 'Unable to sign out right now.'),
                    }),
                  ),
                ),
              )
            : of(authApiEvents.logoutSuccess()),
        ),
      ),

      refreshToken$: events
        .on(authApiEvents.tokenRefreshFailure)
        .pipe(map(() => authPageEvents.logoutClicked())),
    }),
  ),

  // Methods for navigation side effects
  withMethods(
    (
      store,
      events = inject(Events),
      router = inject(Router),
      tokenService = inject(TokenService),
    ) => {
      events.on(authApiEvents.signinSuccess).subscribe((event) => {
        tokenService.saveTokens(event.payload.accessToken, event.payload.refreshToken);
        if (event.payload.user) {
          tokenService.saveUser(event.payload.user);
        }
      });
      events.on(authApiEvents.tokenRefreshSuccess).subscribe((event) => {
        tokenService.saveTokens(event.payload.accessToken, event.payload.refreshToken);
      });
      events.on(authApiEvents.signinSuccess).subscribe(() => router.navigate(['/books']));
      events.on(authApiEvents.signupSuccess).subscribe(() =>
        router.navigate(['/auth/signin'], {
          queryParams: { signup: 'success' },
        }),
      );
      events.on(authApiEvents.logoutSuccess).subscribe(() => {
        tokenService.clearAll();
        router.navigate(['/auth/signin']);
      });
      events.on(authApiEvents.tokenRefreshFailure).subscribe(() => {
        tokenService.clearAll();
        router.navigate(['/auth/signin']);
      });
      return {};
    },
  ),

  withHooks({
    onInit(store) {
      const tokenService = inject(TokenService);
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      const user = tokenService.getUser();
      if (accessToken && refreshToken) {
        patchState(store, {
          accessToken,
          refreshToken,
          user,
        });
      }
    },
  }),
);
