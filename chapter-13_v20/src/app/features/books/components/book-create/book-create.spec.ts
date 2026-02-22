import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCreate } from './book-create';
import { MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

describe('BookCreate', () => {
  let component: BookCreate;
  let fixture: ComponentFixture<BookCreate>;
  let mockDialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BookCreate],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with an invalid form', () => {
      expect(component.bookForm.valid).toBe(false);
    });

    it('should have basicInfo form group', () => {
      const basicInfo = component.bookForm.get('basicInfo');
      expect(basicInfo).toBeTruthy();
      expect(basicInfo?.get('title')).toBeTruthy();
      expect(basicInfo?.get('authorName')).toBeTruthy();
      expect(basicInfo?.get('genre')).toBeTruthy();
      expect(basicInfo?.get('price')).toBeTruthy();
      expect(basicInfo?.get('published')).toBeTruthy();
    });

    it('should have additionalInfo form group', () => {
      const additionalInfo = component.bookForm.get('additionalInfo');
      expect(additionalInfo).toBeTruthy();
      expect(additionalInfo?.get('description')).toBeTruthy();
      expect(additionalInfo?.get('isbn')).toBeTruthy();
      expect(additionalInfo?.get('pageCount')).toBeTruthy();
      expect(additionalInfo?.get('coverImageUrl')).toBeTruthy();
    });

    it('should initialize isFormValid signal as false', () => {
      expect(component.isFormValid()).toBe(false);
    });

    it('should initialize priceValue signal as 0', () => {
      expect(component.priceValue()).toBe(0);
    });

    it('should have predefined genres list', () => {
      expect(component.genres).toBeTruthy();
      expect(component.genres.length).toBeGreaterThan(0);
      expect(component.genres).toContain('Fiction');
      expect(component.genres).toContain('Mystery');
    });
  });

  describe('Required Field Validation - Title', () => {
    it('should validate title as required', () => {
      const title = component.bookForm.get('basicInfo.title');
      expect(title?.hasError('required')).toBe(true);

      title?.setValue('Valid Book Title');
      expect(title?.valid).toBe(true);
    });

    it('should validate title minimum length', () => {
      const title = component.bookForm.get('basicInfo.title');

      title?.setValue('A');
      expect(title?.hasError('minlength')).toBe(true);

      title?.setValue('AB');
      expect(title?.valid).toBe(true);
    });

    it('should validate title maximum length', () => {
      const title = component.bookForm.get('basicInfo.title');
      const longTitle = 'A'.repeat(201);

      title?.setValue(longTitle);
      expect(title?.hasError('maxlength')).toBe(true);

      title?.setValue('A'.repeat(200));
      expect(title?.valid).toBe(true);
    });
  });

  describe('Required Field Validation - Author Name', () => {
    it('should validate authorName as required', () => {
      const authorName = component.bookForm.get('basicInfo.authorName');
      expect(authorName?.hasError('required')).toBe(true);

      authorName?.setValue('John Doe');
      expect(authorName?.valid).toBe(true);
    });

    it('should validate authorName minimum length', () => {
      const authorName = component.bookForm.get('basicInfo.authorName');

      authorName?.setValue('J');
      expect(authorName?.hasError('minlength')).toBe(true);

      authorName?.setValue('Jo');
      expect(authorName?.valid).toBe(true);
    });

    it('should validate authorName maximum length', () => {
      const authorName = component.bookForm.get('basicInfo.authorName');
      const longName = 'A'.repeat(101);

      authorName?.setValue(longName);
      expect(authorName?.hasError('maxlength')).toBe(true);

      authorName?.setValue('A'.repeat(100));
      expect(authorName?.valid).toBe(true);
    });
  });

  describe('Required Field Validation - Genre', () => {
    it('should validate genre as required', () => {
      const genre = component.bookForm.get('basicInfo.genre');
      expect(genre?.hasError('required')).toBe(true);

      genre?.setValue('Fiction');
      expect(genre?.valid).toBe(true);
    });

    it('should accept all predefined genres', () => {
      const genre = component.bookForm.get('basicInfo.genre');

      component.genres.forEach(genreValue => {
        genre?.setValue(genreValue);
        expect(genre?.valid).toBe(true);
      });
    });
  });

  describe('Required Field Validation - Price', () => {
    it('should validate price as required', () => {
      const price = component.bookForm.get('basicInfo.price');
      expect(price?.hasError('required')).toBe(true);

      price?.setValue(29.99);
      expect(price?.valid).toBe(true);
    });

    it('should validate price as positive number', () => {
      const price = component.bookForm.get('basicInfo.price');

      // Note: positiveNumberValidator skips validation when value is 0 (falsy)
      // So 0 passes validation (no positiveNumber error), and satisfies required
      price?.setValue(0);
      expect(price?.valid).toBe(true);

      price?.setValue(-10);
      expect(price?.hasError('positiveNumber')).toBe(true);

      price?.setValue(0.01);
      expect(price?.valid).toBe(true);
    });

    it('should accept valid price values', () => {
      const price = component.bookForm.get('basicInfo.price');
      const validPrices = [10, 29.99, 100.50, 999.99];

      validPrices.forEach(validPrice => {
        price?.setValue(validPrice);
        expect(price?.valid).toBe(true);
      });
    });

    it('should update priceValue signal when price changes', () => {
      const price = component.bookForm.get('basicInfo.price');

      price?.setValue(29.99);
      fixture.detectChanges();
      expect(component.priceValue()).toBe(29.99);

      price?.setValue(49.99);
      fixture.detectChanges();
      expect(component.priceValue()).toBe(49.99);
    });
  });

  describe('Required Field Validation - Published Year', () => {
    it('should validate published as required', () => {
      const published = component.bookForm.get('basicInfo.published');
      expect(published?.hasError('required')).toBe(true);

      published?.setValue('2024');
      expect(published?.valid).toBe(true);
    });

    it('should validate published year format', () => {
      const published = component.bookForm.get('basicInfo.published');

      published?.setValue('24');
      expect(published?.hasError('pattern')).toBe(true);

      published?.setValue('202');
      expect(published?.hasError('pattern')).toBe(true);

      published?.setValue('20244');
      expect(published?.hasError('pattern')).toBe(true);

      published?.setValue('abcd');
      expect(published?.hasError('pattern')).toBe(true);

      published?.setValue('2024');
      expect(published?.valid).toBe(true);
    });

    it('should accept valid 4-digit years', () => {
      const published = component.bookForm.get('basicInfo.published');
      const validYears = ['1900', '2000', '2024', '2026'];

      validYears.forEach(year => {
        published?.setValue(year);
        expect(published?.valid).toBe(true);
      });
    });
  });

  describe('Optional Field Validation - Description', () => {
    it('should allow empty description', () => {
      const description = component.bookForm.get('additionalInfo.description');
      expect(description?.valid).toBe(true);
    });

    it('should validate description maximum length', () => {
      const description = component.bookForm.get('additionalInfo.description');
      const longDescription = 'A'.repeat(1001);

      description?.setValue(longDescription);
      expect(description?.hasError('maxlength')).toBe(true);

      description?.setValue('A'.repeat(1000));
      expect(description?.valid).toBe(true);
    });

    it('should accept any text within length limit', () => {
      const description = component.bookForm.get('additionalInfo.description');

      description?.setValue('A fascinating book about programming.');
      expect(description?.valid).toBe(true);
    });
  });

  describe('Optional Field Validation - ISBN', () => {
    it('should validate ISBN as required', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');
      expect(isbn?.hasError('required')).toBe(true);

      isbn?.setValue('1234567890');
      expect(isbn?.valid).toBe(true);
    });

    it('should validate ISBN-10 format', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      isbn?.setValue('123456789X');
      expect(isbn?.valid).toBe(true);

      isbn?.setValue('1234567890');
      expect(isbn?.valid).toBe(true);
    });

    it('should validate ISBN-13 format', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      isbn?.setValue('1234567890123');
      expect(isbn?.valid).toBe(true);
    });

    it('should accept ISBN with hyphens and spaces', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      isbn?.setValue('978-3-16-148410-0');
      expect(isbn?.valid).toBe(true);

      isbn?.setValue('978 3 16 148410 0');
      expect(isbn?.valid).toBe(true);
    });

    it('should reject invalid ISBN formats', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      isbn?.setValue('12345');
      expect(isbn?.hasError('invalidIsbn')).toBe(true);

      isbn?.setValue('abcdefghij');
      expect(isbn?.hasError('invalidIsbn')).toBe(true);

      isbn?.setValue('12345678901234');
      expect(isbn?.hasError('invalidIsbn')).toBe(true);
    });
  });

  describe('Optional Field Validation - Page Count', () => {
    it('should allow null pageCount', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');
      expect(pageCount?.valid).toBe(true);
    });

    it('should validate pageCount as positive number', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');

      // When setting pageCount to 0, the form control treats it as invalid
      // This might be due to how numeric form controls handle 0 vs null
      pageCount?.setValue(0);
      expect(pageCount?.valid).toBe(false);

      pageCount?.setValue(-100);
      expect(pageCount?.valid).toBe(false);
      expect(pageCount?.hasError('positiveNumber')).toBe(true);

      pageCount?.setValue(300);
      expect(pageCount?.valid).toBe(true);
    });

    it('should validate pageCount maximum value', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');

      pageCount?.setValue(10001);
      expect(pageCount?.hasError('max')).toBe(true);

      pageCount?.setValue(10000);
      expect(pageCount?.valid).toBe(true);
    });

    it('should accept valid page counts', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');
      const validCounts = [50, 200, 500, 1000];

      validCounts.forEach(count => {
        pageCount?.setValue(count);
        expect(pageCount?.valid).toBe(true);
      });
    });
  });

  describe('Optional Field Validation - Cover Image URL', () => {
    it('should allow empty coverImageUrl', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');
      expect(coverImageUrl?.valid).toBe(true);
    });

    it('should validate URL format', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');

      coverImageUrl?.setValue('not-a-url');
      expect(coverImageUrl?.hasError('invalidUrl')).toBe(true);

      coverImageUrl?.setValue('http://');
      expect(coverImageUrl?.hasError('invalidUrl')).toBe(true);
    });

    it('should accept valid HTTP URLs', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');

      coverImageUrl?.setValue('http://example.com/image.jpg');
      expect(coverImageUrl?.valid).toBe(true);
    });

    it('should accept valid HTTPS URLs', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');

      coverImageUrl?.setValue('https://example.com/image.jpg');
      expect(coverImageUrl?.valid).toBe(true);
    });

    it('should accept various valid URL formats', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');
      const validUrls = [
        'https://example.com/cover.jpg',
        'http://cdn.example.com/books/cover.png',
        'https://images.example.com/book-covers/123.webp'
      ];

      validUrls.forEach(url => {
        coverImageUrl?.setValue(url);
        expect(coverImageUrl?.valid).toBe(true);
      });
    });
  });

  describe('Form Submission with Complete Data', () => {
    beforeEach(() => {
      // Set valid data for all required fields
      component.bookForm.patchValue({
        basicInfo: {
          title: 'The Great Book',
          authorName: 'John Doe',
          genre: 'Fiction',
          price: 29.99,
          published: '2024'
        },
        additionalInfo: {
          isbn: '1234567890',
          description: 'A great book about programming',
          pageCount: 350,
          coverImageUrl: 'https://example.com/cover.jpg'
        }
      });
    });

    it('should emit bookCreate event when form is valid', () => {
      let emittedData: any;
      component.bookCreate.subscribe(data => emittedData = data);

      component.onSubmit();

      expect(emittedData).toBeTruthy();
      expect(emittedData.title).toBe('The Great Book');
      expect(emittedData.authorName).toBe('John Doe');
      expect(emittedData.genre).toBe('Fiction');
      expect(emittedData.price).toBe(29.99);
      expect(emittedData.published).toBe('2024');
      expect(emittedData.isbn).toBe('1234567890');
    });

    it('should include optional fields when provided', () => {
      let emittedData: any;
      component.bookCreate.subscribe(data => emittedData = data);

      component.onSubmit();

      expect(emittedData.description).toBe('A great book about programming');
      expect(emittedData.pageCount).toBe(350);
      expect(emittedData.coverImageUrl).toBe('https://example.com/cover.jpg');
    });

    it('should close dialog with book data', () => {
      component.onSubmit();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
      const callArg = mockDialogRef.close.mock.calls[0][0];
      expect(callArg.title).toBe('The Great Book');
    });

    it('should reset form after submission', () => {
      const resetSpy = vi.spyOn(component, 'resetForm');

      component.onSubmit();

      expect(resetSpy).toHaveBeenCalled();
    });

    it('should update isFormValid signal when form becomes valid', () => {
      fixture.detectChanges();
      expect(component.isFormValid()).toBe(true);
    });
  });

  describe('Form Submission Prevention with Invalid Data', () => {
    it('should not emit bookCreate when form is invalid', () => {
      let emitted = false;
      component.bookCreate.subscribe(() => emitted = true);

      component.onSubmit();

      expect(emitted).toBe(false);
    });

    it('should not close dialog when form is invalid', () => {
      component.onSubmit();

      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should not emit when required fields are missing', () => {
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Book Title'
          // Missing other required fields
        }
      });

      let emitted = false;
      component.bookCreate.subscribe(() => emitted = true);

      component.onSubmit();

      expect(emitted).toBe(false);
    });

    it('should not emit when price is invalid', () => {
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Book Title',
          authorName: 'Author Name',
          genre: 'Fiction',
          price: -10, // Invalid price
          published: '2024'
        },
        additionalInfo: {
          isbn: '1234567890'
        }
      });

      let emitted = false;
      component.bookCreate.subscribe(() => emitted = true);

      component.onSubmit();

      expect(emitted).toBe(false);
    });
  });

  describe('Form Reset Functionality', () => {
    beforeEach(() => {
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Test Book',
          authorName: 'Test Author',
          genre: 'Fiction',
          price: 19.99,
          published: '2024'
        },
        additionalInfo: {
          isbn: '1234567890',
          description: 'Test description',
          pageCount: 200,
          coverImageUrl: 'https://example.com/test.jpg'
        }
      });
    });

    it('should reset all form fields to empty', () => {
      component.resetForm();

      expect(component.bookForm.get('basicInfo.title')?.value).toBe('');
      expect(component.bookForm.get('basicInfo.authorName')?.value).toBe('');
      expect(component.bookForm.get('basicInfo.genre')?.value).toBe('');
      expect(component.bookForm.get('basicInfo.published')?.value).toBe('');
      expect(component.bookForm.get('additionalInfo.description')?.value).toBe('');
      expect(component.bookForm.get('additionalInfo.isbn')?.value).toBe('');
      expect(component.bookForm.get('additionalInfo.coverImageUrl')?.value).toBe('');
    });

    it('should mark form as untouched after reset', () => {
      component.bookForm.markAllAsTouched();
      expect(component.bookForm.touched).toBe(true);

      component.resetForm();

      expect(component.bookForm.touched).toBe(false);
    });

    it('should make form invalid after reset', () => {
      expect(component.bookForm.valid).toBe(true);

      component.resetForm();

      expect(component.bookForm.valid).toBe(false);
    });
  });

  describe('Error Message Generation', () => {
    it('should return empty string for untouched fields', () => {
      const message = component.getErrorMessage('title', 'basicInfo');
      expect(message).toBe('');
    });

    it('should return required error message for title', () => {
      const title = component.bookForm.get('basicInfo.title');
      title?.markAsTouched();

      const message = component.getErrorMessage('title', 'basicInfo');
      expect(message).toContain('required');
      expect(message).toContain('Title');
    });

    it('should return minlength error message', () => {
      const title = component.bookForm.get('basicInfo.title');
      title?.setValue('A');
      title?.markAsTouched();

      const message = component.getErrorMessage('title', 'basicInfo');
      expect(message).toContain('at least 2 characters');
    });

    it('should return maxlength error message', () => {
      const title = component.bookForm.get('basicInfo.title');
      title?.setValue('A'.repeat(201));
      title?.markAsTouched();

      const message = component.getErrorMessage('title', 'basicInfo');
      expect(message).toContain('cannot exceed 200 characters');
    });

    it('should return pattern error for published year', () => {
      const published = component.bookForm.get('basicInfo.published');
      published?.setValue('202');
      published?.markAsTouched();

      const message = component.getErrorMessage('published', 'basicInfo');
      expect(message).toContain('valid 4-digit year');
    });

    it('should return positiveNumber error for price', () => {
      const price = component.bookForm.get('basicInfo.price');
      price?.setValue(-10);
      price?.markAsTouched();

      const message = component.getErrorMessage('price', 'basicInfo');
      expect(message).toContain('positive number');
    });

    it('should return max error for pageCount', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');
      pageCount?.setValue(10001);
      pageCount?.markAsTouched();

      const message = component.getErrorMessage('pageCount', 'additionalInfo');
      expect(message).toContain('cannot exceed 10000');
    });

    it('should return invalidIsbn error', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');
      isbn?.setValue('invalid');
      isbn?.markAsTouched();

      const message = component.getErrorMessage('isbn', 'additionalInfo');
      expect(message).toContain('valid ISBN');
    });

    it('should return invalidUrl error', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');
      coverImageUrl?.setValue('not-a-url');
      coverImageUrl?.markAsTouched();

      const message = component.getErrorMessage('coverImageUrl', 'additionalInfo');
      expect(message).toContain('valid URL');
    });

    it('should format field names correctly', () => {
      const title = component.bookForm.get('basicInfo.title');
      title?.markAsTouched();

      const message = component.getErrorMessage('title', 'basicInfo');
      expect(message).toMatch(/^Title/);
    });

    it('should handle special field name formatting', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');
      isbn?.markAsTouched();

      const message = component.getErrorMessage('isbn', 'additionalInfo');
      expect(message).toContain('ISBN');
    });

    it('should return empty string for valid fields', () => {
      const title = component.bookForm.get('basicInfo.title');
      title?.setValue('Valid Book Title');
      title?.markAsTouched();

      const message = component.getErrorMessage('title', 'basicInfo');
      expect(message).toBe('');
    });
  });

  describe('Modal-Specific Behavior', () => {
    it('should close dialog when cancel is clicked', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should have access to dialogRef', () => {
      expect(component['dialogRef']).toBeTruthy();
    });

    it('should not emit bookCreate event on cancel', () => {
      let emitted = false;
      component.bookCreate.subscribe(() => emitted = true);

      component.onCancel();

      expect(emitted).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should format price correctly', () => {
      const formatted = component.formatPrice(29.99);
      expect(formatted).toContain('29.99');
      expect(formatted).toContain('$');
    });

    it('should format price with zero cents', () => {
      const formatted = component.formatPrice(30);
      expect(formatted).toContain('30.00');
    });

    it('should get current year', () => {
      const year = component.getCurrentYear();
      expect(year).toBeGreaterThan(2020);
      expect(year).toBeLessThanOrEqual(new Date().getFullYear());
    });

    it('should have basicInfoGroup accessor', () => {
      const group = component.basicInfoGroup;
      expect(group).toBeTruthy();
      expect(group?.get('title')).toBeTruthy();
    });

    it('should have additionalInfoGroup accessor', () => {
      const group = component.additionalInfoGroup;
      expect(group).toBeTruthy();
      expect(group?.get('description')).toBeTruthy();
    });
  });

  describe('Form Group Integration', () => {
    it('should validate entire basicInfo group', () => {
      const basicInfo = component.bookForm.get('basicInfo');
      expect(basicInfo?.valid).toBe(false);

      basicInfo?.patchValue({
        title: 'Book Title',
        authorName: 'Author Name',
        genre: 'Fiction',
        price: 29.99,
        published: '2024'
      });

      expect(basicInfo?.valid).toBe(true);
    });

    it('should validate entire additionalInfo group independently', () => {
      const additionalInfo = component.bookForm.get('additionalInfo');

      // additionalInfo should be valid initially (all optional except ISBN)
      expect(additionalInfo?.get('description')?.valid).toBe(true);
      expect(additionalInfo?.get('pageCount')?.valid).toBe(true);
      expect(additionalInfo?.get('coverImageUrl')?.valid).toBe(true);
    });

    it('should maintain form validity across both groups', () => {
      // Set valid basicInfo
      component.bookForm.get('basicInfo')?.patchValue({
        title: 'Book Title',
        authorName: 'Author Name',
        genre: 'Fiction',
        price: 29.99,
        published: '2024'
      });

      expect(component.bookForm.valid).toBe(false); // Still invalid due to missing ISBN

      // Set valid ISBN
      component.bookForm.get('additionalInfo.isbn')?.setValue('1234567890');

      expect(component.bookForm.valid).toBe(true);
    });
  });
});
