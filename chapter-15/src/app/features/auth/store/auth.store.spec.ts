import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dispatcher } from '@ngrx/signals/events';
import { of, throwError, delay } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { AuthService } from '../services/auth.service';
import { authPageEvents, authApiEvents } from './auth.events';

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let dispatcher: Dispatcher;
  let authService: {
    signin: ReturnType<typeof vi.fn>;
    signup: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const mockUser = {
    id: '1',
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
    };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
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

      expect(router.navigate).toHaveBeenCalledWith(['/auth/signin']);
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
    it('should clear all auth state', () => {
      // First, simulate a logged-in state
      dispatcher.dispatch(authApiEvents.signinSuccess(mockAuthResponse));
      expect(store.isAuthenticated()).toBe(true);

      // Now logout
      dispatcher.dispatch(authPageEvents.logoutClicked());

      expect(store.user()).toBeNull();
      expect(store.accessToken()).toBeNull();
      expect(store.refreshToken()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
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
