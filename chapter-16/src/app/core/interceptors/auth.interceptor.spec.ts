import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { vi } from "vitest";
import { authInterceptor } from "./auth.interceptors";
import { AuthService } from "../../features/auth/services/auth.service";
import { TokenService } from "../services/token.service";
import { UserInfo } from "../../shared/models/auth";

const mockUser: UserInfo = {
  id: '123',
  keycloakId: 'kc-123',
  email: 'test@bookstore.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
};

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpMock.verify();
    tokenService.clearAll();
  });

  describe('header injection', () => {
    it('should add Authorization header when token exists', () => {
      tokenService.saveTokens('test-token', 'test-refresh');
      tokenService.saveUser(mockUser);

      http.get('/api/books').subscribe();

      const req = httpMock.expectOne('/api/books');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush([]);
    });

    it('should add X-User-Id header when user exists', () => {
      tokenService.saveTokens('test-token', 'test-refresh');
      tokenService.saveUser(mockUser);

      http.get('/api/books').subscribe();

      const req = httpMock.expectOne('/api/books');
      expect(req.request.headers.get('X-User-Id')).toBe('kc-123');
      req.flush([]);
    });

    it('should not add Authorization header when no token', () => {
      http.get('/api/books').subscribe();

      const req = httpMock.expectOne('/api/books');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush([]);
    });

    it('should not add X-User-Id header when no user', () => {
      http.get('/api/books').subscribe();

      const req = httpMock.expectOne('/api/books');
      expect(req.request.headers.has('X-User-Id')).toBe(false);
      req.flush([]);
    });
  });

  describe('auth endpoint passthrough', () => {
    beforeEach(() => {
      tokenService.saveTokens('test-token', 'test-refresh');
      tokenService.saveUser(mockUser);
    });

    it('should not add Authorization header for /users/signin', () => {
      http.post('/users/signin', {}).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/users/signin'));
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should not add Authorization header for /users/signup', () => {
      http.post('/users/signup', {}).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/users/signup'));
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should not add Authorization header for /users/refresh-token', () => {
      http.post('/users/refresh-token', {}).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/users/refresh-token'));
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  describe('401 handling', () => {
    it('should refresh token and retry request on 401', () => {
      const authService = TestBed.inject(AuthService);
      tokenService.saveTokens('expired-token', 'valid-refresh');
      tokenService.saveUser(mockUser);

      vi.spyOn(authService, 'refreshToken').mockImplementation(() => {
        // Simulate the store side effect of saving new tokens to localStorage
        tokenService.saveTokens('new-token', 'new-refresh');
        return of({ accessToken: 'new-token', refreshToken: 'new-refresh' });
      });

      let responseReceived = false;
      http.get('/api/books').subscribe(() => (responseReceived = true));

      const firstReq = httpMock.expectOne('/api/books');
      expect(firstReq.request.headers.get('Authorization')).toBe('Bearer expired-token');
      firstReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      const retryReq = httpMock.expectOne('/api/books');
      expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-token');
      retryReq.flush([]);

      expect(authService.refreshToken).toHaveBeenCalledWith('valid-refresh');
      expect(responseReceived).toBe(true);
    });

    it('should propagate error and not retry when no refresh token available', () => {
      let errorThrown = false;

      http.get('/api/books').subscribe({ error: () => (errorThrown = true) });

      const req = httpMock.expectOne('/api/books');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(errorThrown).toBe(true);
    });

    it('should propagate error when token refresh request fails', () => {
      const authService = TestBed.inject(AuthService);
      tokenService.saveTokens('expired-token', 'invalid-refresh');
      tokenService.saveUser(mockUser);

      vi.spyOn(authService, 'refreshToken').mockReturnValue(
        throwError(() => new Error('Refresh failed'))
      );

      let errorThrown = false;
      http.get('/api/books').subscribe({ error: () => (errorThrown = true) });

      const req = httpMock.expectOne('/api/books');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(errorThrown).toBe(true);
    });

    it('should pass through non-401 errors without retrying', () => {
      tokenService.saveTokens('test-token', 'test-refresh');
      tokenService.saveUser(mockUser);

      let errorStatus: number | undefined;
      http.get('/api/books').subscribe({
        error: (e: HttpErrorResponse) => (errorStatus = e.status),
      });

      const req = httpMock.expectOne('/api/books');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(errorStatus).toBe(404);
    });
  });
});
