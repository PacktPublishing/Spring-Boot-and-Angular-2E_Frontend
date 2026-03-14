import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController, provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserProfile } from '../../../shared/models/auth';

const mockUser = {
  id: '123',
  keycloakId: 'kc-123',
  email: 'test@bookstore.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
};

const mockAuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  tokenType: 'Bearer',
  expiresIn: 300,
  user: mockUser,
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { httpMock.verify(); });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signin', () => {
    it('should POST credentials and return mapped response', () => {
      const credentials = { email: 'test@bookstore.com', password: 'password123' };

      service.signin(credentials).subscribe((result) => {
        expect(result.accessToken).toBe('mock-access-token');
        expect(result.refreshToken).toBe('mock-refresh-token');
        expect(result.user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(r => r.url.includes('/users/signin'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockAuthResponse);
    });

    it('should map only user, accessToken, and refreshToken from the response', () => {
      const credentials = { email: 'test@bookstore.com', password: 'password123' };
      let mapped: any;

      service.signin(credentials).subscribe(result => (mapped = result));

      httpMock.expectOne(r => r.url.includes('/users/signin')).flush(mockAuthResponse);

      expect(Object.keys(mapped)).toEqual(['user', 'accessToken', 'refreshToken']);
    });
  });

  describe('signup', () => {
    it('should POST registration data and return void', () => {
      const signupData = {
        email: 'new@bookstore.com',
        password: 'secret',
        firstName: 'New',
        lastName: 'User',
      };
      let emitted = false;

      service.signup(signupData).subscribe(() => (emitted = true));

      const req = httpMock.expectOne(r => r.url.includes('/users/signup'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(signupData);
      req.flush({ success: true, message: 'User registered' });

      expect(emitted).toBe(true);
    });

    it('should include optional fields when provided', () => {
      const signupData = {
        email: 'new@bookstore.com',
        password: 'secret',
        firstName: 'New',
        lastName: 'User',
        phone: '555-0100',
        address: '1 Main St',
        city: 'Athens',
        state: 'Attica',
        zipCode: '10001',
        country: 'GR',
      };

      service.signup(signupData).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/users/signup'));
      expect(req.request.body).toEqual(signupData);
      req.flush({ success: true, message: 'User registered' });
    });
  });

  describe('refreshToken', () => {
    it('should POST the refresh token and return new tokens', () => {
      service.refreshToken('old-refresh-token').subscribe((result) => {
        expect(result.accessToken).toBe('mock-access-token');
        expect(result.refreshToken).toBe('mock-refresh-token');
      });

      const req = httpMock.expectOne(r => r.url.includes('/users/refresh-token'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'old-refresh-token' });
      req.flush(mockAuthResponse);
    });

    it('should map only accessToken and refreshToken from the response', () => {
      let mapped: any;

      service.refreshToken('old-refresh-token').subscribe(result => (mapped = result));

      httpMock.expectOne(r => r.url.includes('/users/refresh-token')).flush(mockAuthResponse);

      expect(Object.keys(mapped)).toEqual(['accessToken', 'refreshToken']);
    });
  });

  describe('logout', () => {
    it('should POST to logout endpoint and return void', () => {
      let emitted = false;

      service.logout().subscribe(() => (emitted = true));

      const req = httpMock.expectOne(r => r.url.includes('/users/logout'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({ success: true, message: 'Logged out' });

      expect(emitted).toBe(true);
    });
  });

  describe('getProfile', () => {
    it('should GET the user profile', () => {
      const mockProfile: UserProfile = {
        firstName: 'Test',
        lastName: 'User',
        phone: '555-0100',
        city: 'Athens',
      };

      service.getProfile().subscribe((profile) => {
        expect(profile).toEqual(mockProfile);
      });

      const req = httpMock.expectOne(r => r.url.includes('/users/profile'));
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });

    it('should handle a profile with only required fields', () => {
      const minimalProfile: UserProfile = { firstName: 'Min', lastName: 'Mal' };
      let result: UserProfile | undefined;

      service.getProfile().subscribe(p => (result = p));

      httpMock.expectOne(r => r.url.includes('/users/profile')).flush(minimalProfile);

      expect(result).toEqual(minimalProfile);
    });
  });

  describe('updateProfile', () => {
    it('should PUT the updated profile and return the saved profile', () => {
      const updatedProfile: UserProfile = {
        firstName: 'Updated',
        lastName: 'User',
        city: 'Thessaloniki',
      };

      service.updateProfile(updatedProfile).subscribe((profile) => {
        expect(profile).toEqual(updatedProfile);
      });

      const req = httpMock.expectOne(r => r.url.includes('/users/profile'));
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProfile);
      req.flush(updatedProfile);
    });

    it('should return the server response, not the request payload', () => {
      const sentProfile: UserProfile = { firstName: 'Before', lastName: 'Save' };
      const serverProfile: UserProfile = { firstName: 'After', lastName: 'Save', city: 'Patras' };
      let result: UserProfile | undefined;

      service.updateProfile(sentProfile).subscribe(p => (result = p));

      httpMock.expectOne(r => r.url.includes('/users/profile')).flush(serverProfile);

      expect(result).toEqual(serverProfile);
    });
  });
});
