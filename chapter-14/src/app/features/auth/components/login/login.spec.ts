import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with an invalid form', () => {
      expect(component.loginForm.valid).toBe(false);
    });

    it('should have all required form controls', () => {
      expect(component.loginForm.get('email')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
      expect(component.loginForm.get('rememberMe')).toBeTruthy();
    });

    it('should initialize with hidePassword as true', () => {
      expect(component.hidePassword).toBe(true);
    });

    it('should initialize rememberMe as false', () => {
      expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    });

    it('should initialize isFormValid signal as false', () => {
      expect(component.isFormValid()).toBe(false);
    });

    it('should initialize isSubmitting signal as false', () => {
      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('Email Field Validation', () => {
    it('should validate email as required', () => {
      const email = component.loginForm.get('email');
      expect(email?.hasError('required')).toBe(true);

      email?.setValue('test@example.com');
      expect(email?.valid).toBe(true);
    });

    it('should validate email format', () => {
      const email = component.loginForm.get('email');

      email?.setValue('invalid');
      expect(email?.hasError('email')).toBe(true);

      email?.setValue('invalid@');
      expect(email?.hasError('email')).toBe(true);

      email?.setValue('@domain.com');
      expect(email?.hasError('email')).toBe(true);

      email?.setValue('valid@email.com');
      expect(email?.valid).toBe(true);
    });

    it('should accept various valid email formats', () => {
      const email = component.loginForm.get('email');
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com'
      ];

      validEmails.forEach(validEmail => {
        email?.setValue(validEmail);
        expect(email?.valid).toBe(true);
      });
    });
  });

  describe('Password Field Validation', () => {
    it('should validate password as required', () => {
      const password = component.loginForm.get('password');
      expect(password?.hasError('required')).toBe(true);

      password?.setValue('password123');
      expect(password?.valid).toBe(true);
    });

    it('should validate minimum password length', () => {
      const password = component.loginForm.get('password');

      password?.setValue('short');
      expect(password?.hasError('minlength')).toBe(true);

      password?.setValue('1234567');
      expect(password?.hasError('minlength')).toBe(true);

      password?.setValue('12345678');
      expect(password?.valid).toBe(true);
    });

    it('should accept passwords with 8 or more characters', () => {
      const password = component.loginForm.get('password');
      const validPasswords = [
        'password',
        'Password123',
        'Strong@Pass1',
        'verylongpassword123456'
      ];

      validPasswords.forEach(validPassword => {
        password?.setValue(validPassword);
        expect(password?.valid).toBe(true);
      });
    });
  });

  describe('Remember Me Checkbox', () => {
    it('should toggle rememberMe value', () => {
      const rememberMe = component.loginForm.get('rememberMe');

      expect(rememberMe?.value).toBe(false);

      rememberMe?.setValue(true);
      expect(rememberMe?.value).toBe(true);

      rememberMe?.setValue(false);
      expect(rememberMe?.value).toBe(false);
    });

    it('should not affect form validity', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');
      const rememberMe = component.loginForm.get('rememberMe');

      email?.setValue('test@example.com');
      password?.setValue('password123');

      rememberMe?.setValue(false);
      expect(component.loginForm.valid).toBe(true);

      rememberMe?.setValue(true);
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('Form Submission with Valid Data', () => {
    it('should emit loginSubmit event when form is valid', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');
      const rememberMe = component.loginForm.get('rememberMe');

      email?.setValue('test@example.com');
      password?.setValue('password123');
      rememberMe?.setValue(true);

      let emittedData: any;
      component.loginSubmit.subscribe(data => emittedData = data);

      component.onSubmit();

      expect(emittedData).toEqual({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      });
    });

    it('should emit correct data with rememberMe as false', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');

      email?.setValue('user@test.com');
      password?.setValue('mypassword');

      let emittedData: any;
      component.loginSubmit.subscribe(data => emittedData = data);

      component.onSubmit();

      expect(emittedData).toEqual({
        email: 'user@test.com',
        password: 'mypassword',
        rememberMe: false
      });
    });

    it('should update isFormValid signal when form becomes valid', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');

      expect(component.isFormValid()).toBe(false);

      email?.setValue('test@example.com');
      password?.setValue('password123');
      fixture.detectChanges();

      expect(component.isFormValid()).toBe(true);
    });
  });

  describe('Form Submission Prevention with Invalid Data', () => {
    it('should not emit loginSubmit when email is invalid', () => {
      const password = component.loginForm.get('password');
      password?.setValue('password123');

      let emitted = false;
      component.loginSubmit.subscribe(() => emitted = true);

      component.onSubmit();

      expect(emitted).toBe(false);
    });

    it('should not emit loginSubmit when password is invalid', () => {
      const email = component.loginForm.get('email');
      email?.setValue('test@example.com');

      let emitted = false;
      component.loginSubmit.subscribe(() => emitted = true);

      component.onSubmit();

      expect(emitted).toBe(false);
    });

    it('should not emit loginSubmit when both fields are invalid', () => {
      let emitted = false;
      component.loginSubmit.subscribe(() => emitted = true);

      component.onSubmit();

      expect(emitted).toBe(false);
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');

      expect(email?.touched).toBe(false);
      expect(password?.touched).toBe(false);

      component.onSubmit();

      expect(email?.touched).toBe(true);
      expect(password?.touched).toBe(true);
    });

    it('should not emit when form is empty', () => {
      let emittedData: any;
      component.loginSubmit.subscribe(data => emittedData = data);

      component.onSubmit();

      expect(emittedData).toBeUndefined();
    });
  });

  describe('Error Message Generation', () => {
    it('should return empty string for untouched fields', () => {
      const emailMessage = component.getErrorMessage('email');
      const passwordMessage = component.getErrorMessage('password');

      expect(emailMessage).toBe('');
      expect(passwordMessage).toBe('');
    });

    it('should return required error message for email', () => {
      const email = component.loginForm.get('email');
      email?.markAsTouched();

      const message = component.getErrorMessage('email');
      expect(message).toContain('required');
      expect(message).toContain('Email');
    });

    it('should return email validation error', () => {
      const email = component.loginForm.get('email');
      email?.setValue('invalid');
      email?.markAsTouched();

      const message = component.getErrorMessage('email');
      expect(message).toContain('valid email');
    });

    it('should return required error message for password', () => {
      const password = component.loginForm.get('password');
      password?.markAsTouched();

      const message = component.getErrorMessage('password');
      expect(message).toContain('required');
      expect(message).toContain('Password');
    });

    it('should return minlength error message for password', () => {
      const password = component.loginForm.get('password');
      password?.setValue('short');
      password?.markAsTouched();

      const message = component.getErrorMessage('password');
      expect(message).toContain('at least 8 characters');
    });

    it('should return empty string for valid fields', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');

      email?.setValue('test@example.com');
      email?.markAsTouched();
      password?.setValue('password123');
      password?.markAsTouched();

      expect(component.getErrorMessage('email')).toBe('');
      expect(component.getErrorMessage('password')).toBe('');
    });

    it('should format field names correctly', () => {
      const email = component.loginForm.get('email');
      email?.markAsTouched();

      const message = component.getErrorMessage('email');
      expect(message).toMatch(/^Email/);
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle hidePassword property', () => {
      expect(component.hidePassword).toBe(true);

      component.hidePassword = !component.hidePassword;
      expect(component.hidePassword).toBe(false);

      component.hidePassword = !component.hidePassword;
      expect(component.hidePassword).toBe(true);
    });

    it('should change password field type based on hidePassword', () => {
      fixture.detectChanges();

      const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
      expect(passwordInput).toBeTruthy();

      // Initially should be password type
      expect(passwordInput.type).toBe('password');

      // Toggle visibility
      component.hidePassword = false;
      fixture.detectChanges();
      expect(passwordInput.type).toBe('text');

      // Toggle back
      component.hidePassword = true;
      fixture.detectChanges();
      expect(passwordInput.type).toBe('password');
    });

    it('should display correct icon based on hidePassword state', () => {
      fixture.detectChanges();

      // Check initial state
      let visibilityIcon = fixture.nativeElement.querySelector('button[matSuffix] mat-icon');
      if (visibilityIcon) {
        expect(visibilityIcon.textContent?.trim()).toBe('visibility_off');
      }

      // Toggle visibility
      component.hidePassword = false;
      fixture.detectChanges();
      visibilityIcon = fixture.nativeElement.querySelector('button[matSuffix] mat-icon');
      if (visibilityIcon) {
        expect(visibilityIcon.textContent?.trim()).toBe('visibility');
      }
    });

    it('should not submit form when clicking visibility toggle', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');

      email?.setValue('test@example.com');
      password?.setValue('password123');

      let emitted = false;
      component.loginSubmit.subscribe(() => emitted = true);

      const toggleButton = fixture.nativeElement.querySelector('button[matSuffix]');
      if (toggleButton) {
        toggleButton.click();
        expect(emitted).toBe(false);
      }
    });
  });

  describe('Forgot Password Functionality', () => {
    it('should emit forgotPassword with email when email is valid', () => {
      const email = component.loginForm.get('email');
      email?.setValue('test@example.com');

      let emittedEmail: string | undefined;
      component.forgotPassword.subscribe(email => emittedEmail = email);

      component.onForgotPassword();

      expect(emittedEmail).toBe('test@example.com');
    });

    it('should emit empty string when email is invalid', () => {
      const email = component.loginForm.get('email');
      email?.setValue('invalid-email');

      let emittedEmail: string | undefined;
      component.forgotPassword.subscribe(email => emittedEmail = email);

      component.onForgotPassword();

      expect(emittedEmail).toBe('');
    });

    it('should emit empty string when email is empty', () => {
      let emittedEmail: string | undefined;
      component.forgotPassword.subscribe(email => emittedEmail = email);

      component.onForgotPassword();

      expect(emittedEmail).toBe('');
    });
  });

  describe('Reactive State Management', () => {
    it('should update isFormValid signal when form validity changes', () => {
      expect(component.isFormValid()).toBe(false);

      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');

      email?.setValue('test@example.com');
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(false); // Still invalid (password missing)

      password?.setValue('password123');
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(true);

      email?.setValue('');
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(false);
    });

    it('should maintain form state across multiple changes', () => {
      const email = component.loginForm.get('email');
      const password = component.loginForm.get('password');

      // Make valid
      email?.setValue('test@example.com');
      password?.setValue('password123');
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(true);

      // Make invalid
      email?.setValue('invalid');
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(false);

      // Make valid again
      email?.setValue('test@example.com');
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(true);
    });
  });
});
