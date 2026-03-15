import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController, provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

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

  it('should POST credentials and return mapped response', () => {
    const credentials = {
      email: 'test@bookstore.com', password: 'password123',
    };
    const mockResponse = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      tokenType: 'Bearer', expiresIn: 300,
      user: {
        id: '123', keycloakId: 'kc-123',
        email: 'test@bookstore.com',
        firstName: 'Test', lastName: 'User',
        role: 'user',
      },
    };

    // Step 1: Call the service method
    service.signin(credentials).subscribe((result) => {
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.user.email).toBe('test@bookstore.com');
      // tokenType and expiresIn are stripped by map()
      expect((result as any).tokenType).toBeUndefined();
    });

    // Step 2: Assert the captured request
    const req = httpMock.expectOne(
      r => r.url.includes('/users/signin')
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    // Step 3: Flush a simulated response
    req.flush(mockResponse);
  });

  it('should POST signup data and return void', () => {
    const signupData = {
      email: 'new@bookstore.com',
      password: 'Password123',
      firstName: 'Jane',
      lastName: 'Doe',
    };

    service.signup(signupData).subscribe((result) => {
      expect(result).toBeUndefined();
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/signup'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(signupData);

    req.flush({ success: true, message: 'User created' });
  });

  it('should POST refreshToken and return both tokens', () => {
    const refreshTokenValue = 'old-refresh-token';
    const mockResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      tokenType: 'Bearer',
      expiresIn: 300,
      user: null,
    };

    service.refreshToken(refreshTokenValue).subscribe((result) => {
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      // tokenType, expiresIn, and user are stripped by map()
      expect((result as any).tokenType).toBeUndefined();
      expect((result as any).expiresIn).toBeUndefined();
      expect((result as any).user).toBeUndefined();
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/refresh-token'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: refreshTokenValue });

    req.flush(mockResponse);
  });

  it('should POST logout with no parameters and return void', () => {
    service.logout().subscribe((result) => {
      expect(result).toBeUndefined();
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/logout'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush({ success: true, message: 'Logged out' });
  });

  it('should GET profile and return user profile', () => {
    const mockProfile = {
      firstName: 'Test',
      lastName: 'User',
      phone: '555-1234',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'US',
    };

    service.getProfile().subscribe((result) => {
      expect(result).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/profile'));
    expect(req.request.method).toBe('GET');

    req.flush(mockProfile);
  });

  it('should PUT profile with body and return updated profile', () => {
    const updatedProfile = {
      firstName: 'Updated',
      lastName: 'Name',
      phone: '555-9999',
      address: '456 New Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'US',
    };

    service.updateProfile(updatedProfile).subscribe((result) => {
      expect(result).toEqual(updatedProfile);
      expect(result.firstName).toBe('Updated');
      expect(result.city).toBe('Chicago');
    });

    const req = httpMock.expectOne(r => r.url.includes('/users/profile'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProfile);

    req.flush(updatedProfile);
  });
});
