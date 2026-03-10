import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { Router } from '@angular/router';
import { exhaustMap, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authPageEvents, authApiEvents } from './auth.events';
import { initialAuthState } from './auth.state';
import { withEventHandlers, on, Events, withReducer } from '@ngrx/signals/events';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  // Initialize state
  withState(initialAuthState),

  // Reducers handle state changes
  withReducer(
    // Signin flow
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

    // Signup flow
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

    // Logout
    on(authPageEvents.logoutClicked, () => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
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
    ) => ({
      // Handle signin
      signin$: events.on(authPageEvents.signinSubmitted).pipe(
        exhaustMap((event) =>
          authService.signin(event.payload).pipe(
            map((response) => authApiEvents.signinSuccess(response)),
            catchError((error: { message: string }) =>
              of(authApiEvents.signinFailure({ error: error.message })),
            ),
          ),
        ),
      ),

      // Handle signup
      signup$: events.on(authPageEvents.signupSubmitted).pipe(
        exhaustMap((event) =>
          authService.signup(event.payload).pipe(
            map(() => authApiEvents.signupSuccess()),
            catchError((error: { message: string }) =>
              of(authApiEvents.signupFailure({ error: error.message })),
            ),
          ),
        ),
      ),
    }),
  ),

  // Methods for navigation side effects
  withMethods((store, events = inject(Events), router = inject(Router)) => {
    // Navigate after successful signin
    events.on(authApiEvents.signinSuccess).subscribe(() => router.navigate(['/books']));

    // Navigate after successful signup
    events.on(authApiEvents.signupSuccess).subscribe(() => router.navigate(['/auth/signin']));

    return {};
  }),
);
