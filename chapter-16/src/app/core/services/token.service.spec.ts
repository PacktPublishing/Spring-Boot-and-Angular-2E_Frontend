import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TokenService } from './token.service';
import { UserInfo } from '../../shared/models/auth';

const ACCESS_TOKEN_KEY = 'bookstore_access_token';
const REFRESH_TOKEN_KEY = 'bookstore_refresh_token';
const USER_KEY = 'bookstore_user';

describe('TokenService', () => {
  let service: TokenService;
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let removeItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('saveTokens', () => {
    it('should store access token and refresh token in localStorage', () => {
      service.saveTokens('access-abc', 'refresh-xyz');

      expect(setItemSpy).toHaveBeenCalledWith(ACCESS_TOKEN_KEY, 'access-abc');
      expect(setItemSpy).toHaveBeenCalledWith(REFRESH_TOKEN_KEY, 'refresh-xyz');
      expect(setItemSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('saveUser', () => {
    it('should serialize and store UserInfo as JSON', () => {
      const user: UserInfo = {
        id: '1',
        keycloakId: 'kc-1',
        email: 'user@bookstore.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'user',
      };

      service.saveUser(user);

      expect(setItemSpy).toHaveBeenCalledWith(USER_KEY, JSON.stringify(user));
    });
  });

  describe('getAccessToken', () => {
    it('should return the stored access token', () => {
      getItemSpy.mockReturnValue('access-abc');

      const result = service.getAccessToken();

      expect(getItemSpy).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
      expect(result).toBe('access-abc');
    });

    it('should return null when access token is not set', () => {
      getItemSpy.mockReturnValue(null);

      expect(service.getAccessToken()).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return the stored refresh token', () => {
      getItemSpy.mockReturnValue('refresh-xyz');

      const result = service.getRefreshToken();

      expect(getItemSpy).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
      expect(result).toBe('refresh-xyz');
    });

    it('should return null when refresh token is not set', () => {
      getItemSpy.mockReturnValue(null);

      expect(service.getRefreshToken()).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return parsed UserInfo when valid JSON is stored', () => {
      const user: UserInfo = {
        id: '1',
        keycloakId: 'kc-1',
        email: 'user@bookstore.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'user',
      };
      getItemSpy.mockReturnValue(JSON.stringify(user));

      const result = service.getUser();

      expect(getItemSpy).toHaveBeenCalledWith(USER_KEY);
      expect(result).toEqual(user);
    });

    it('should return null when no user is stored', () => {
      getItemSpy.mockReturnValue(null);

      expect(service.getUser()).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      getItemSpy.mockReturnValue('{invalid');

      expect(service.getUser()).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should remove access token, refresh token, and user from localStorage', () => {
      service.clearAll();

      expect(removeItemSpy).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
      expect(removeItemSpy).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
      expect(removeItemSpy).toHaveBeenCalledWith(USER_KEY);
      expect(removeItemSpy).toHaveBeenCalledTimes(3);
    });
  });
});
