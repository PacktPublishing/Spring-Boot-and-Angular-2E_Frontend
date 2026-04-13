import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dispatcher } from '@ngrx/signals/events';
import { authGuard, guestGuard } from './auth.guard';
import { AuthStore } from '../../features/auth/store/auth.store';
import { authApiEvents } from '../../features/auth/store/auth.events';
import { TokenService } from '../services/token.service';
import { AuthService } from '../../features/auth/services/auth.service';

const mockUser = {
  id: '1',
  keycloakId: 'kc-abc',
  email: 'user@bookstore.com',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'user',
};

const mockAuthResponse = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

describe('Auth Guards', () => {
  let router: Router;
  let dispatcher: Dispatcher;
  let store: InstanceType<typeof AuthStore>;

  const mockTokenService = {
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    getUser: vi.fn(),
    saveTokens: vi.fn(),
    saveUser: vi.fn(),
    clearAll: vi.fn(),
  };

  const mockAuthService = {
    signin: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockTokenService.getAccessToken.mockReturnValue(null);
    mockTokenService.getUser.mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        provideRouter([]),
        { provide: TokenService, useValue: mockTokenService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    router = TestBed.inject(Router);
    dispatcher = TestBed.inject(Dispatcher);
    store = TestBed.inject(AuthStore);
  });

  describe('authGuard', () => {
    it('should return true when authenticated via store', () => {
      dispatcher.dispatch(authApiEvents.signinSuccess(mockAuthResponse));

      const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

      expect(result).toBe(true);
    });

    it('should return true when access token exists in TokenService', () => {
      mockTokenService.getAccessToken.mockReturnValue('stored-token');

      const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

      expect(result).toBe(true);
    });

    it('should return UrlTree to /auth/signin when not authenticated', () => {
      const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

      expect(result).toEqual(router.createUrlTree(['/auth/signin']));
    });
  });

  describe('guestGuard', () => {
    it('should return true when not authenticated', () => {
      const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

      expect(result).toBe(true);
    });

    it('should return UrlTree to /books when authenticated via store', () => {
      dispatcher.dispatch(authApiEvents.signinSuccess(mockAuthResponse));

      const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

      expect(result).toEqual(router.createUrlTree(['/books']));
    });

    it('should return UrlTree to /books when access token exists in TokenService', () => {
      mockTokenService.getAccessToken.mockReturnValue('stored-token');

      const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

      expect(result).toEqual(router.createUrlTree(['/books']));
    });
  });
});
