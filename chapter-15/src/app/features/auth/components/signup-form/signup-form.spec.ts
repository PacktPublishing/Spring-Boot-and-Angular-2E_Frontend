import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SignupForm } from './signup-form';

describe('SignupForm', () => {
  let component: SignupForm;
  let fixture: ComponentFixture<SignupForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupForm],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  describe('Form Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with an invalid form', () => {
      expect(component.signupForm.valid).toBe(false);
    });

    it('should have all required form controls', () => {
      expect(component.signupForm.get('firstName')).toBeTruthy();
      expect(component.signupForm.get('lastName')).toBeTruthy();
      expect(component.signupForm.get('email')).toBeTruthy();
      expect(component.signupForm.get('agreeToTerms')).toBeTruthy();
    });

    it('should have nested password group', () => {
      const passwordsGroup = component.signupForm.get('passwords');
      expect(passwordsGroup).toBeTruthy();
      expect(passwordsGroup?.get('password')).toBeTruthy();
      expect(passwordsGroup?.get('confirmPassword')).toBeTruthy();
    });
  });

  describe('Field Validation', () => {
    it('should validate firstName as required', () => {
      const firstName = component.signupForm.get('firstName');
      expect(firstName?.hasError('required')).toBe(true);
      firstName?.setValue('John');
      expect(firstName?.valid).toBe(true);
    });

    it('should reject firstName with numbers', () => {
      const firstName = component.signupForm.get('firstName');
      firstName?.setValue('John123');
      expect(firstName?.hasError('noNumbers')).toBe(true);
    });

    it('should validate email format', () => {
      const email = component.signupForm.get('email');
      email?.setValue('invalid');
      expect(email?.hasError('email')).toBe(true);
      email?.setValue('valid@email.com');
      expect(email?.valid).toBe(true);
    });

    it('should validate password minimum length', () => {
      const password = component.signupForm.get('passwords.password');
      password?.setValue('short');
      expect(password?.hasError('minlength')).toBe(true);
      password?.setValue('LongEnough1');
      expect(password?.hasError('minlength')).toBe(false);
    });
  });

  describe('Cross-Field Validation', () => {
    it('should detect password mismatch', () => {
      const passwordsGroup = component.signupForm.get('passwords');
      passwordsGroup?.get('password')?.setValue('Strong@Pass1');
      passwordsGroup?.get('confirmPassword')?.setValue('Different@Pass1');
      passwordsGroup?.updateValueAndValidity();
      expect(passwordsGroup?.hasError('passwordMismatch')).toBe(true);
    });

    it('should pass when passwords match', () => {
      const passwordsGroup = component.signupForm.get('passwords');
      passwordsGroup?.get('password')?.setValue('Strong@Pass1');
      passwordsGroup?.get('confirmPassword')?.setValue('Strong@Pass1');
      passwordsGroup?.updateValueAndValidity();
      expect(passwordsGroup?.hasError('passwordMismatch')).toBe(false);
    });
  });

  describe('Error Messages', () => {
    it('should return empty string for untouched fields', () => {
      expect(component.getErrorMessage('firstName')).toBe('');
    });

    it('should return required error message', () => {
      const firstName = component.signupForm.get('firstName');
      firstName?.markAsTouched();
      expect(component.getErrorMessage('firstName')).toContain('required');
    });

    it('should return group error for password mismatch', () => {
      const passwordsGroup = component.signupForm.get('passwords');
      passwordsGroup?.get('password')?.setValue('Strong@Pass1');
      passwordsGroup?.get('confirmPassword')?.setValue('Different@Pass1');
      passwordsGroup?.markAsTouched();
      expect(component.getGroupErrorMessage('passwords')).toContain('do not match');
    });
  });

  describe('Form Submission', () => {
    it('should emit signupComplete with correct data', () => {
      const emitSpy = vi.spyOn(component.signupComplete, 'emit');

      component.signupForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        passwords: {
          password: 'Strong@Pass1',
          confirmPassword: 'Strong@Pass1',
        },
        agreeToTerms: true,
      });

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Strong@Pass1',
        }),
      );
    });

    it('should not emit when form is invalid', () => {
      const emitSpy = vi.spyOn(component.signupComplete, 'emit');
      component.onSubmit();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
