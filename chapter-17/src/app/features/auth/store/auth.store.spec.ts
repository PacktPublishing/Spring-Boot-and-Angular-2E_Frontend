import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dispatcher } from '@ngrx/signals/events';
import { of, throwError, delay } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { AuthService } from '../services/auth.service';
import { authPageEvents, authApiEvents } from './auth.events';
import { TokenService } from '../../../core/services/token.service';

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let dispatcher: Dispatcher;
  let authService: {
    signin: ReturnType<typeof vi.fn>;
    signup: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let tokenService: {
    saveTokens: ReturnType<typeof vi.fn>;
    saveUser: ReturnType<typeof vi.fn>;
    getAccessToken: ReturnType<typeof vi.fn>;
    getRefreshToken: ReturnType<typeof vi.fn>;
    getUser: ReturnType<typeof vi.fn>;
    clearAll: ReturnType<typeof vi.fn>;
  };

  const mockUser = {
    id: '1',
    keycloakId: 'keycloak-user-1',
    email: 'test@bookstore.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'USER',
  };

  const mockAuthResponse = {
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(() => {
    authService = {
      signin: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    };
    router = { navigate: vi.fn() };
    tokenService = {
      saveTokens: vi.fn(),
      saveUser: vi.fn(),
      getAccessToken: vi.fn().mockReturnValue(null),
      getRefreshToken: vi.fn().mockReturnValue(null),
      getUser: vi.fn().mockReturnValue(null),
      clearAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: TokenService, useValue: tokenService },
      ],
    });

    store = TestBed.inject(AuthStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  describe('Initial State', () => {
    it('should have no authenticated user', () => {
      expect(store.user()).toBeNull();
      expect(store.accessToken()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });

  describe('Signin Flow', () => {
    it('should set loading when signin is submitted', () => {
      authService.signin.mockReturnValue(of(mockAuthResponse).pipe(delay(50)));

      dispatcher.dispatch(
        authPageEvents.signinSubmitted({
          email: 'test@bookstore.com',
          password: 'password123',
        }),
      );

      expect(store.loading()).toBe(true);
      expect(store.error()).toBeNull();
    });

    it('should store user and tokens on signin success', () => {
      dispatcher.dispatch(authApiEvents.signinSuccess(mockAuthResponse));

      expect(store.user()).toEqual(mockUser);
      expect(store.accessToken()).toBe('mock-access-token');
      expect(store.refreshToken()).toBe('mock-refresh-token');
      expect(store.loading()).toBe(false);
      expect(store.isAuthenticated()).toBe(true);
    });

    it('should set error on signin failure', () => {
      dispatcher.dispatch(
        authApiEvents.signinFailure({
          error: 'Invalid credentials',
        }),
      );

      expect(store.error()).toBe('Invalid credentials');
      expect(store.loading()).toBe(false);
      expect(store.isAuthenticated()).toBe(false);
    });

    it('should call auth service when signin submitted', async () => {
      authService.signin.mockReturnValue(of(mockAuthResponse));

      dispatcher.dispatch(
        authPageEvents.signinSubmitted({
          email: 'test@bookstore.com',
          password: 'password123',
        }),
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(authService.signin).toHaveBeenCalledWith({
        email: 'test@bookstore.com',
        password: 'password123',
      });
      expect(store.isAuthenticated()).toBe(true);
      expect(store.user()).toEqual(mockUser);
    });

    it('should handle service errors', async () => {
      const error = new Error('Network error');
      authService.signin.mockReturnValue(throwError(() => error));

      dispatcher.dispatch(
        authPageEvents.signinSubmitted({
          email: 'test@bookstore.com',
          password: 'wrong',
        }),
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(store.error()).toBe('Network error');
      expect(store.isAuthenticated()).toBe(false);
    });

    it('should navigate to /books on signin success', async () => {
      authService.signin.mockReturnValue(of(mockAuthResponse));

      dispatcher.dispatch(
        authPageEvents.signinSubmitted({
          email: 'test@bookstore.com',
          password: 'password123',
        }),
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(router.navigate).toHaveBeenCalledWith(['/books']);
    });
  });

  describe('Signup Flow', () => {
    it('should set loading when signup submitted', () => {
      authService.signup.mockReturnValue(of(void 0).pipe(delay(50)));

      dispatcher.dispatch(
        authPageEvents.signupSubmitted({
          email: 'new@bookstore.com',
          password: 'SecurePass123!',
          firstName: 'Bob',
          lastName: 'Smith',
        }),
      );

      expect(store.loading()).toBe(true);
      expect(store.error()).toBeNull();
    });

    it('should clear loading on signup success', () => {
      dispatcher.dispatch(authApiEvents.signupSuccess());

      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should navigate to signin on signup success', async () => {
      authService.signup.mockReturnValue(of(void 0));

      dispatcher.dispatch(
        authPageEvents.signupSubmitted({
          email: 'new@bookstore.com',
          password: 'SecurePass123!',
          firstName: 'Bob',
          lastName: 'Smith',
        }),
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(router.navigate).toHaveBeenCalledWith(['/auth/signin'], {
        queryParams: { signup: 'success' },
      });
    });

    it('should set error on signup failure', () => {
      dispatcher.dispatch(
        authApiEvents.signupFailure({
          error: 'Email already exists',
        }),
      );

      expect(store.error()).toBe('Email already exists');
      expect(store.loading()).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should call logout service and clear auth state on success', async () => {
      authService.logout.mockReturnValue(of(void 0));
      tokenService.getAccessToken.mockReturnValue('mock-access-token');

      dispatcher.dispatch(authApiEvents.signinSuccess(mockAuthResponse));
      expect(store.isAuthenticated()).toBe(true);

      dispatcher.dispatch(authPageEvents.logoutClicked());

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(authService.logout).toHaveBeenCalled();
      expect(store.user()).toBeNull();
      expect(store.accessToken()).toBeNull();
      expect(store.refreshToken()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(tokenService.clearAll).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/signin']);
    });

    it('should clear auth state immediately when no access token exists', async () => {
      tokenService.getAccessToken.mockReturnValue(null);

      dispatcher.dispatch(authApiEvents.signinSuccess(mockAuthResponse));
      dispatcher.dispatch(authPageEvents.logoutClicked());

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(authService.logout).not.toHaveBeenCalled();
      expect(store.user()).toBeNull();
      expect(store.accessToken()).toBeNull();
      expect(store.refreshToken()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(tokenService.clearAll).toHaveBeenCalled();
    });
  });

  describe('Computed Signals', () => {
    it('should compute userDisplayName', () => {
      expect(store.userDisplayName()).toBe('');

      dispatcher.dispatch(authApiEvents.signinSuccess(mockAuthResponse));

      expect(store.userDisplayName()).toBe('Alice Johnson');
    });

    it('should compute isAuthenticated from token', () => {
      expect(store.isAuthenticated()).toBe(false);

      dispatcher.dispatch(authApiEvents.signinSuccess(mockAuthResponse));

      expect(store.isAuthenticated()).toBe(true);
    });
  });
});
