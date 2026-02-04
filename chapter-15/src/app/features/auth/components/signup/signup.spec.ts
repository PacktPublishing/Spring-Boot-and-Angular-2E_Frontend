import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signup } from './signup';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        provideNativeDateAdapter(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      expect(component.signupForm.get('dateOfBirth')).toBeTruthy();
      expect(component.signupForm.get('agreeToTerms')).toBeTruthy();
    });

    it('should have nested password group', () => {
      const passwordsGroup = component.signupForm.get('passwords');
      expect(passwordsGroup).toBeTruthy();
      expect(passwordsGroup?.get('password')).toBeTruthy();
      expect(passwordsGroup?.get('confirmPassword')).toBeTruthy();
    });

    it('should have nested address group', () => {
      const addressGroup = component.signupForm.get('address');
      expect(addressGroup).toBeTruthy();
      expect(addressGroup?.get('street')).toBeTruthy();
      expect(addressGroup?.get('city')).toBeTruthy();
      expect(addressGroup?.get('country')).toBeTruthy();
    });

    it('should initialize with empty favoriteGenres array', () => {
      expect(component.genresArray.length).toBe(0);
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

    it('should validate password requirements', () => {
      const password = component.signupForm.get('passwords.password');

      password?.setValue('weak');
      expect(password?.hasError('minlength')).toBe(true);

      password?.setValue('NoSpecialChar1');
      expect(password?.hasError('pattern')).toBe(true);

      password?.setValue('Strong@Pass1');
      expect(password?.valid).toBe(true);
    });

    it('should validate minimum age requirement', () => {
      const dateOfBirth = component.signupForm.get('dateOfBirth');

      // Set date to 10 years ago (below minimum age of 13)
      const tooYoung = new Date();
      tooYoung.setFullYear(tooYoung.getFullYear() - 10);
      dateOfBirth?.setValue(tooYoung);
      expect(dateOfBirth?.hasError('minimumAge')).toBe(true);

      // Set date to 20 years ago (above minimum age)
      const validAge = new Date();
      validAge.setFullYear(validAge.getFullYear() - 20);
      dateOfBirth?.setValue(validAge);
      expect(dateOfBirth?.valid).toBe(true);
    });

    it('should require agreeToTerms to be true', () => {
      const agreeToTerms = component.signupForm.get('agreeToTerms');

      agreeToTerms?.setValue(false);
      expect(agreeToTerms?.hasError('required')).toBe(true);

      agreeToTerms?.setValue(true);
      expect(agreeToTerms?.valid).toBe(true);
    });
  });

  describe('Cross-Field Validation', () => {
    it('should validate password match', () => {
      const passwordsGroup = component.signupForm.get('passwords');
      const password = passwordsGroup?.get('password');
      const confirmPassword = passwordsGroup?.get('confirmPassword');

      password?.setValue('Strong@Pass1');
      confirmPassword?.setValue('Different@Pass1');
      passwordsGroup?.updateValueAndValidity();

      expect(passwordsGroup?.hasError('passwordMismatch')).toBe(true);

      confirmPassword?.setValue('Strong@Pass1');
      passwordsGroup?.updateValueAndValidity();

      expect(passwordsGroup?.hasError('passwordMismatch')).toBe(false);
    });
  });

  describe('FormArray Operations', () => {
    it('should add genre to array', () => {
      const initialLength = component.genresArray.length;
      component.addGenre();
      expect(component.genresArray.length).toBe(initialLength + 1);
    });

    it('should remove genre from array', () => {
      component.addGenre();
      component.addGenre();
      const lengthAfterAdding = component.genresArray.length;

      component.removeGenre(0);
      expect(component.genresArray.length).toBe(lengthAfterAdding - 1);
    });

    it('should validate genre fields', () => {
      component.addGenre();
      const genreControl = component.genresArray.at(0);

      expect(genreControl.hasError('required')).toBe(true);

      genreControl.setValue('F');
      expect(genreControl.hasError('minlength')).toBe(true);

      genreControl.setValue('Fantasy');
      expect(genreControl.valid).toBe(true);
    });

    it('should handle multiple genres', () => {
      component.addGenre();
      component.addGenre();
      component.addGenre();

      component.genresArray.at(0).setValue('Fantasy');
      component.genresArray.at(1).setValue('Mystery');
      component.genresArray.at(2).setValue('Romance');

      expect(component.genresArray.valid).toBe(true);
      expect(component.genresArray.value).toEqual(['Fantasy', 'Mystery', 'Romance']);
    });
  });

  describe('Password Strength', () => {
    it('should calculate weak password strength', () => {
      const strength = component.calculatePasswordStrength('pass');
      expect(strength).toBeLessThan(40);

      // Set the form value to test the label
      component.signupForm.get('passwords.password')?.setValue('pass');
      fixture.detectChanges();
      expect(component.getPasswordStrengthLabel()).toBe('Weak');
    });

    it('should calculate fair password strength', () => {
      const strength = component.calculatePasswordStrength('Password');
      expect(strength).toBeGreaterThanOrEqual(40);
      expect(strength).toBeLessThan(80);

      // Set the form value to test the label
      component.signupForm.get('passwords.password')?.setValue('Password');
      fixture.detectChanges();
      expect(component.getPasswordStrengthLabel()).toBe('Fair');
    });

    it('should calculate strong password strength', () => {
      const strength = component.calculatePasswordStrength('Strong@Pass1');
      expect(strength).toBe(100);

      // Set the form value to test the label
      component.signupForm.get('passwords.password')?.setValue('Strong@Pass1');
      fixture.detectChanges();
      expect(component.getPasswordStrengthLabel()).toBe('Strong');
    });

    it('should return correct color for password strength', () => {
      // Weak password
      component.signupForm.get('passwords.password')?.setValue('pass');
      fixture.detectChanges();
      expect(component.getPasswordStrengthColor()).toBe('warn');

      // Strong password
      component.signupForm.get('passwords.password')?.setValue('Strong@Pass1');
      fixture.detectChanges();
      expect(component.getPasswordStrengthColor()).toBe('primary');
    });
  });

  describe('Error Messages', () => {
    it('should return empty string for untouched fields', () => {
      const message = component.getErrorMessage('firstName');
      expect(message).toBe('');
    });

    it('should return required error message', () => {
      const firstName = component.signupForm.get('firstName');
      firstName?.markAsTouched();

      const message = component.getErrorMessage('firstName');
      expect(message).toContain('required');
    });

    it('should return email validation error', () => {
      const email = component.signupForm.get('email');
      email?.setValue('invalid');
      email?.markAsTouched();

      const message = component.getErrorMessage('email');
      expect(message).toContain('valid email');
    });

    it('should return group error for password mismatch', () => {
      const passwordsGroup = component.signupForm.get('passwords');
      passwordsGroup?.get('password')?.setValue('Strong@Pass1');
      passwordsGroup?.get('confirmPassword')?.setValue('Different@Pass1');
      passwordsGroup?.markAsTouched();

      const message = component.getGroupErrorMessage('passwords');
      expect(message).toContain('do not match');
    });
  });
});
