import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { SigninForm } from './signin-form';

describe('SigninForm', () => {
  let component: SigninForm;
  let fixture: ComponentFixture<SigninForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninForm],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  describe('Form Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with an invalid form', () => {
      expect(component.signinForm.valid).toBe(false);
    });

    it('should have email control', () => {
      expect(component.signinForm.get('email')).toBeTruthy();
    });

    it('should have password control', () => {
      expect(component.signinForm.get('password')).toBeTruthy();
    });

    it('should have rememberMe control defaulting to false', () => {
      const rememberMe = component.signinForm.get('rememberMe');
      expect(rememberMe).toBeTruthy();
      expect(rememberMe?.value).toBe(false);
    });

    it('should expose isFormValid signal reflecting form status', () => {
      expect(component.isFormValid()).toBe(false);
    });

    it('should set isFormValid to true when form is valid', async () => {
      component.signinForm.setValue({
        email: 'user@example.com',
        password: 'Secret1!',
        rememberMe: false,
      });
      await fixture.whenStable();
      expect(component.isFormValid()).toBe(true);
    });
  });

  describe('Required Field Validation', () => {
    it('should mark email as required when empty', () => {
      const email = component.signinForm.get('email');
      expect(email?.hasError('required')).toBe(true);
    });

    it('should mark password as required when empty', () => {
      const password = component.signinForm.get('password');
      expect(password?.hasError('required')).toBe(true);
    });

    it('should clear required error on email once filled', () => {
      const email = component.signinForm.get('email');
      email?.setValue('user@example.com');
      expect(email?.hasError('required')).toBe(false);
    });

    it('should clear required error on password once filled', () => {
      const password = component.signinForm.get('password');
      password?.setValue('Secret1!');
      expect(password?.hasError('required')).toBe(false);
    });
  });

  describe('Email Format Validation', () => {
    it('should reject an invalid email format', () => {
      const email = component.signinForm.get('email');
      email?.setValue('not-an-email');
      expect(email?.hasError('email')).toBe(true);
    });

    it('should reject email without domain', () => {
      const email = component.signinForm.get('email');
      email?.setValue('user@');
      expect(email?.hasError('email')).toBe(true);
    });

    it('should accept a valid email address', () => {
      const email = component.signinForm.get('email');
      email?.setValue('user@example.com');
      expect(email?.valid).toBe(true);
    });
  });

  describe('Optional Field Handling', () => {
    it('should keep form valid when rememberMe is false', () => {
      component.signinForm.setValue({
        email: 'user@example.com',
        password: 'Secret1!',
        rememberMe: false,
      });
      expect(component.signinForm.valid).toBe(true);
    });

    it('should keep form valid when rememberMe is true', () => {
      component.signinForm.setValue({
        email: 'user@example.com',
        password: 'Secret1!',
        rememberMe: true,
      });
      expect(component.signinForm.valid).toBe(true);
    });
  });

  describe('Error Messages', () => {
    it('should return empty string for untouched email', () => {
      expect(component.getErrorMessage('email')).toBe('');
    });

    it('should return empty string for untouched password', () => {
      expect(component.getErrorMessage('password')).toBe('');
    });

    it('should return required error for touched empty email', () => {
      component.signinForm.get('email')?.markAsTouched();
      expect(component.getErrorMessage('email')).toContain('required');
    });

    it('should return required error for touched empty password', () => {
      component.signinForm.get('password')?.markAsTouched();
      expect(component.getErrorMessage('password')).toContain('required');
    });

    it('should return email format error for invalid email', () => {
      const email = component.signinForm.get('email');
      email?.setValue('bad-email');
      email?.markAsTouched();
      expect(component.getErrorMessage('email')).toContain('valid email');
    });

    it('should return empty string once email is valid and touched', () => {
      const email = component.signinForm.get('email');
      email?.setValue('user@example.com');
      email?.markAsTouched();
      expect(component.getErrorMessage('email')).toBe('');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should default to hiding the password', () => {
      expect(component.hidePassword).toBe(true);
    });

    it('should toggle hidePassword to false', () => {
      component.hidePassword = false;
      expect(component.hidePassword).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should emit signinComplete with email and password on valid submit', () => {
      const emitSpy = vi.spyOn(component.signinComplete, 'emit');

      component.signinForm.setValue({
        email: 'user@example.com',
        password: 'Secret1!',
        rememberMe: true,
      });

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Secret1!',
      });
    });

    it('should not include rememberMe in the emitted payload', () => {
      const emitSpy = vi.spyOn(component.signinComplete, 'emit');

      component.signinForm.setValue({
        email: 'user@example.com',
        password: 'Secret1!',
        rememberMe: true,
      });

      component.onSubmit();

      const payload = emitSpy.mock.calls[0][0] as unknown as Record<string, unknown>;
      expect('rememberMe' in payload).toBe(false);
    });

    it('should not emit when form is invalid', () => {
      const emitSpy = vi.spyOn(component.signinComplete, 'emit');
      component.onSubmit();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when only email is provided', () => {
      const emitSpy = vi.spyOn(component.signinComplete, 'emit');
      component.signinForm.get('email')?.setValue('user@example.com');
      component.onSubmit();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when only password is provided', () => {
      const emitSpy = vi.spyOn(component.signinComplete, 'emit');
      component.signinForm.get('password')?.setValue('Secret1!');
      component.onSubmit();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
