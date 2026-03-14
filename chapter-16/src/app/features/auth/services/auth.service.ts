import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../../core/services/token.service';
import {
  SigninRequest,
  SignupRequest,
  AuthResponse,
  UserInfo,
  UserProfile,
} from '../../../shared/models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private baseUrl = `${environment.apiUrl}/user/api/users`;

  signin(credentials: SigninRequest): Observable<{
    user: UserInfo;
    accessToken: string;
    refreshToken: string;
  }> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signin`, credentials).pipe(
      map((response) => ({
        user: response.user!,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })),
    );
  }

  signup(data: SignupRequest): Observable<void> {
    return this.http
      .post<{ success: boolean; message: string }>(`${this.baseUrl}/signup`, data)
      .pipe(map(() => undefined));
  }

  refreshToken(refreshToken: string): Observable<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh-token`, { refreshToken }).pipe(
      map((response) => ({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })),
    );
  }

  logout(accessToken: string, keycloakId: string): Observable<void> {
    return this.http
      .post<{ success: boolean; message: string }>(
        `${this.baseUrl}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-User-Id': keycloakId,
          },
        },
      )
      .pipe(map(() => undefined));
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile`, {
      headers: this.buildUserHeaders(),
    });
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/profile`, profile, {
      headers: this.buildUserHeaders(),
    });
  }

  private buildUserHeaders(): Record<string, string> {
    const user = this.tokenService.getUser();
    if (!user?.keycloakId) {
      return {};
    }

    return {
      'X-User-Id': user.keycloakId,
    };
  }
}
