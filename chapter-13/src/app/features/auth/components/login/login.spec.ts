import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideRouter } from '@angular/router';

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

  describe('Form Initialization', () => {
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

    it('should initialize rememberMe as false', () => {
      expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    });

    it('should initialize with hidePassword as true', () => {
      expect(component.hidePassword).toBe(true);
    });
  });

  describe('Field Validation', () => {
    it('should validate email as required', () => {
      const email = component.loginForm.get('email');
      expect(email?.hasError('required')).toBe(true);

      email?.setValue('user@example.com');
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

    it('should validate password as required', () => {
      const password = component.loginForm.get('password');
      expect(password?.hasError('required')).toBe(true);

      password?.setValue('Password123!');
      expect(password?.valid).toBe(true);
    });

    it('should validate password minimum length', () => {
      const password = component.loginForm.get('password');

      password?.setValue('short');
      expect(password?.hasError('minlength')).toBe(true);

      password?.setValue('12345678');
      expect(password?.valid).toBe(true);
    });

    it('should accept valid 8-character password', () => {
      const password = component.loginForm.get('password');
      password?.setValue('Pass1234');
      expect(password?.valid).toBe(true);
    });
  });

  describe('Remember Me Functionality', () => {
    it('should toggle rememberMe checkbox', () => {
      const rememberMe = component.loginForm.get('rememberMe');

      expect(rememberMe?.value).toBe(false);

      rememberMe?.setValue(true);
      expect(rememberMe?.value).toBe(true);

      rememberMe?.setValue(false);
      expect(rememberMe?.value).toBe(false);
    });

    it('should include rememberMe in form submission', () => {
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: true
      });

      let emittedData: any;
      component.loginSubmit.subscribe((data) => {
        emittedData = data;
      });

      component.onSubmit();

      expect(emittedData).toEqual({
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: true
      });
    });
  });

  describe('Form Submission', () => {
    it('should emit loginSubmit event with valid data', () => {
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: false
      });

      let emittedData: any;
      component.loginSubmit.subscribe((data) => {
        emittedData = data;
      });

      component.onSubmit();

      expect(emittedData).toEqual({
        email: 'user@example.com',
        password: 'Password123!',
        rememberMe: false
      });
    });

    it('should not emit loginSubmit event with invalid email', () => {
      component.loginForm.patchValue({
        email: 'invalid-email',
        password: 'Password123!'
      });

      let emittedData: any = undefined;
      component.loginSubmit.subscribe((data) => {
        emittedData = data;
      });

      component.onSubmit();

      expect(emittedData).toBeUndefined();
      expect(component.loginForm.valid).toBe(false);
    });

    it('should not emit loginSubmit event with short password', () => {
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'short'
      });

      let emittedData: any = undefined;
      component.loginSubmit.subscribe((data) => {
        emittedData = data;
      });

      component.onSubmit();

      expect(emittedData).toBeUndefined();
      expect(component.loginForm.valid).toBe(false);
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      component.loginForm.patchValue({
        email: '',
        password: ''
      });

      component.onSubmit();

      expect(component.loginForm.get('email')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });

    it('should not emit loginSubmit with empty fields', () => {
      let emittedData: any = undefined;
      component.loginSubmit.subscribe((data) => {
        emittedData = data;
      });

      component.onSubmit();

      expect(emittedData).toBeUndefined();
      expect(component.loginForm.valid).toBe(false);
    });
  });

  describe('Error Message Generation', () => {
    it('should return empty string for untouched fields', () => {
      const message = component.getErrorMessage('email');
      expect(message).toBe('');
    });

    it('should return required error for email', () => {
      const email = component.loginForm.get('email');
      email?.markAsTouched();

      const message = component.getErrorMessage('email');
      expect(message).toContain('required');
    });

    it('should return email validation error', () => {
      const email = component.loginForm.get('email');
      email?.setValue('invalid-email');
      email?.markAsTouched();

      const message = component.getErrorMessage('email');
      expect(message).toContain('valid email');
    });

    it('should return required error for password', () => {
      const password = component.loginForm.get('password');
      password?.markAsTouched();

      const message = component.getErrorMessage('password');
      expect(message).toContain('required');
    });

    it('should return minlength error for password', () => {
      const password = component.loginForm.get('password');
      password?.setValue('short');
      password?.markAsTouched();

      const message = component.getErrorMessage('password');
      expect(message).toContain('at least 8 characters');
    });

    it('should format field names correctly', () => {
      const email = component.loginForm.get('email');
      email?.markAsTouched();

      const message = component.getErrorMessage('email');
      expect(message).toContain('Email');
    });

    it('should return empty string for valid fields', () => {
      const email = component.loginForm.get('email');
      email?.setValue('user@example.com');
      email?.markAsTouched();

      const message = component.getErrorMessage('email');
      expect(message).toBe('');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should initialize with password hidden', () => {
      expect(component.hidePassword).toBe(true);
    });

    it('should toggle password visibility', () => {
      component.hidePassword = false;
      fixture.detectChanges();
      expect(component.hidePassword).toBe(false);

      component.hidePassword = true;
      fixture.detectChanges();
      expect(component.hidePassword).toBe(true);
    });

    it('should allow multiple toggles', () => {
      expect(component.hidePassword).toBe(true);

      component.hidePassword = !component.hidePassword;
      expect(component.hidePassword).toBe(false);

      component.hidePassword = !component.hidePassword;
      expect(component.hidePassword).toBe(true);

      component.hidePassword = !component.hidePassword;
      expect(component.hidePassword).toBe(false);
    });
  });

  describe('Forgot Password', () => {
    it('should emit forgotPassword with valid email', () => {
      component.loginForm.patchValue({
        email: 'user@example.com'
      });

      let emittedEmail: string | undefined;
      component.forgotPassword.subscribe((email) => {
        emittedEmail = email;
      });

      component.onForgotPassword();

      expect(emittedEmail).toBe('user@example.com');
    });

    it('should emit empty string when email is invalid', () => {
      component.loginForm.patchValue({
        email: 'invalid-email'
      });

      let emittedEmail: string | undefined;
      component.forgotPassword.subscribe((email) => {
        emittedEmail = email;
      });

      component.onForgotPassword();

      expect(emittedEmail).toBe('');
    });

    it('should emit empty string when email is empty', () => {
      component.loginForm.patchValue({
        email: ''
      });

      let emittedEmail: string | undefined;
      component.forgotPassword.subscribe((email) => {
        emittedEmail = email;
      });

      component.onForgotPassword();

      expect(emittedEmail).toBe('');
    });
  });

  describe('Form State Signals', () => {
    it('should reflect form validity in isFormValid signal', () => {
      expect(component.isFormValid()).toBe(false);

      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'Password123!'
      });
      component.loginForm.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.isFormValid()).toBe(true);
    });

    it('should update isFormValid when form becomes invalid', () => {
      component.loginForm.patchValue({
        email: 'user@example.com',
        password: 'Password123!'
      });
      component.loginForm.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.isFormValid()).toBe(true);

      component.loginForm.patchValue({
        email: 'invalid-email'
      });
      component.loginForm.updateValueAndValidity();
      fixture.detectChanges();

      expect(component.isFormValid()).toBe(false);
    });
  });
});
