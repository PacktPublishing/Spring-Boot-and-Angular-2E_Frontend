import { UserInfo } from '../../../shared/models/auth';

export interface AuthState {
  // User data
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;

  // UI state
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};
