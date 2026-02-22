export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  favoriteGenres?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    country: string;
  };
  favoriteGenres: string[];
  agreeToTerms: boolean;
}
