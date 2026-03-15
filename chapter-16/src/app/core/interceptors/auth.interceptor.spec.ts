import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Dispatcher } from '@ngrx/signals/events';
import { authInterceptor } from './auth.interceptors';
import { TokenService } from '../services/token.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserInfo } from '../../shared/models/auth';

const mockUser: UserInfo = {
  id: '1',
  keycloakId: 'kc-abc',
  email: 'user@bookstore.com',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'user',
};

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  // TokenService is entirely mock-based — no real localStorage is touched.
  const mockTokenService = {
    getAccessToken: vi.fn(),
    getUser: vi.fn(),
    getRefreshToken: vi.fn(),
  };

  const mockAuthService = {
    refreshToken: vi.fn(),
  };

  const mockDispatcher = {
    dispatch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: mockTokenService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Dispatcher, useValue: mockDispatcher },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Authorization headers', () => {
    it('should attach Authorization and X-User-Id headers when access token and user exist', () => {
      mockTokenService.getAccessToken.mockReturnValue('access-token-abc');
      mockTokenService.getUser.mockReturnValue(mockUser);

      http.get('/api/books').subscribe();

      const req = httpMock.expectOne('/api/books');
      expect(req.request.headers.get('Authorization')).toBe('Bearer access-token-abc');
      expect(req.request.headers.get('X-User-Id')).toBe('kc-abc');

      req.flush([]);
    });

    it('should not attach auth headers when TokenService returns null for token and user', () => {
      mockTokenService.getAccessToken.mockReturnValue(null);
      mockTokenService.getUser.mockReturnValue(null);

      http.get('/api/books').subscribe();

      const req = httpMock.expectOne('/api/books');
      expect(req.request.headers.has('Authorization')).toBe(false);
      expect(req.request.headers.has('X-User-Id')).toBe(false);

      req.flush([]);
    });
  });

  describe('Auth endpoint bypass', () => {
    it.each(['/users/signin', '/users/signup', '/users/refresh-token'])(
      'should skip auth headers for %s even when a token is present',
      // Token IS present — proves the interceptor skips headers based on the
      // endpoint path, not simply because there is nothing to attach.
      (endpoint) => {
        mockTokenService.getAccessToken.mockReturnValue('access-token-abc');
        mockTokenService.getUser.mockReturnValue(mockUser);

        http.post(endpoint, {}).subscribe();

        const req = httpMock.expectOne(endpoint);
        expect(req.request.headers.has('Authorization')).toBe(false);
        expect(req.request.headers.has('X-User-Id')).toBe(false);

        req.flush({});
      },
    );
  });

  describe('401 handling and token refresh', () => {
    it('should call refreshToken on 401, dispatch tokenRefreshSuccess, and retry with new token', () => {
      // buildAuthHeaders is called twice by the interceptor:
      //   1st — when sending the original request
      //   2nd — when building headers for the retried request after refresh
      mockTokenService.getAccessToken
        .mockReturnValueOnce('old-access-token')
        .mockReturnValueOnce('new-access-token');
      mockTokenService.getUser.mockReturnValue(mockUser);
      mockTokenService.getRefreshToken.mockReturnValue('old-refresh-token');
      mockAuthService.refreshToken.mockReturnValue(
        of({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' }),
      );

      let responseData: unknown;
      http.get('/api/books').subscribe((data) => {
        responseData = data;
      });

      // --- Flush 1: original /api/books request receives 401 ---
      const originalReq = httpMock.expectOne('/api/books');
      expect(originalReq.request.headers.get('Authorization')).toBe('Bearer old-access-token');
      originalReq.flush(
        { message: 'Unauthorized' },
        { status: 401, statusText: 'Unauthorized' },
      );

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith('old-refresh-token');
      expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);
      expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(1);

      // --- Flush 2: retried /api/books request carries the refreshed token ---
      const retryReq = httpMock.expectOne('/api/books');
      expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-access-token');
      expect(retryReq.request.headers.get('X-User-Id')).toBe('kc-abc');
      retryReq.flush([{ title: 'Clean Code' }]);

      expect(responseData).toEqual([{ title: 'Clean Code' }]);
    });
  });
});
