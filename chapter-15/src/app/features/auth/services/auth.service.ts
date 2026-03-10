import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { SigninRequest, SignupRequest, UserInfo } from '../../../shared/models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private mockUser: UserInfo = {
    id: '1',
    email: 'user@bookstore.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'USER',
  };

  signin(credentials: SigninRequest): Observable<{
    user: UserInfo;
    accessToken: string;
    refreshToken: string;
  }> {
    if (credentials.email === 'user@bookstore.com' && credentials.password === 'SecurePass123!') {
      return of({
        user: this.mockUser,
        accessToken: 'mock-access-token-jwt',
        refreshToken: 'mock-refresh-token-jwt',
      }).pipe(delay(500));
    }
    return throwError(() => new Error('Invalid email or password'));
  }

  signup(data: SignupRequest): Observable<void> {
    if (data.email === 'user@bookstore.com') {
      return throwError(() => new Error('Email already exists'));
    }
    return of(void 0).pipe(delay(500));
  }
}
