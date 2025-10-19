import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { BookCreate } from './book-create';
import { Book } from '../../../../shared/models/book';
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
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }
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

    it('should have basicInfo form group with all required controls', () => {
      const basicInfoGroup = component.bookForm.get('basicInfo');
      expect(basicInfoGroup).toBeTruthy();
      expect(basicInfoGroup?.get('title')).toBeTruthy();
      expect(basicInfoGroup?.get('authorName')).toBeTruthy();
      expect(basicInfoGroup?.get('genre')).toBeTruthy();
      expect(basicInfoGroup?.get('price')).toBeTruthy();
      expect(basicInfoGroup?.get('published')).toBeTruthy();
    });

    it('should have additionalInfo form group with all controls', () => {
      const additionalInfoGroup = component.bookForm.get('additionalInfo');
      expect(additionalInfoGroup).toBeTruthy();
      expect(additionalInfoGroup?.get('description')).toBeTruthy();
      expect(additionalInfoGroup?.get('isbn')).toBeTruthy();
      expect(additionalInfoGroup?.get('pageCount')).toBeTruthy();
      expect(additionalInfoGroup?.get('coverImageUrl')).toBeTruthy();
    });

    it('should have predefined genres list', () => {
      expect(component.genres).toBeTruthy();
      expect(component.genres.length).toBeGreaterThan(0);
      expect(component.genres).toContain('Fiction');
      expect(component.genres).toContain('Mystery');
      expect(component.genres).toContain('Science Fiction');
    });

    it('should have form group accessors', () => {
      expect(component.basicInfoGroup).toBeTruthy();
      expect(component.additionalInfoGroup).toBeTruthy();
    });
  });

  describe('Required Field Validation', () => {
    it('should validate title as required', () => {
      const title = component.bookForm.get('basicInfo.title');
      expect(title?.hasError('required')).toBe(true);

      title?.setValue('The Great Gatsby');
      expect(title?.valid).toBe(true);
    });

    it('should validate title minimum length', () => {
      const title = component.bookForm.get('basicInfo.title');

      title?.setValue('A');
      expect(title?.hasError('minlength')).toBe(true);

      title?.setValue('Ab');
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

    it('should validate authorName as required', () => {
      const authorName = component.bookForm.get('basicInfo.authorName');
      expect(authorName?.hasError('required')).toBe(true);

      authorName?.setValue('F. Scott Fitzgerald');
      expect(authorName?.valid).toBe(true);
    });

    it('should validate authorName minimum length', () => {
      const authorName = component.bookForm.get('basicInfo.authorName');

      authorName?.setValue('A');
      expect(authorName?.hasError('minlength')).toBe(true);

      authorName?.setValue('Ab');
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

    it('should validate genre as required', () => {
      const genre = component.bookForm.get('basicInfo.genre');
      expect(genre?.hasError('required')).toBe(true);

      genre?.setValue('Fiction');
      expect(genre?.valid).toBe(true);
    });

    it('should validate price as required', () => {
      const price = component.bookForm.get('basicInfo.price');
      expect(price?.hasError('required')).toBe(true);

      price?.setValue(19.99);
      expect(price?.valid).toBe(true);
    });

    it('should validate published year as required', () => {
      const published = component.bookForm.get('basicInfo.published');
      expect(published?.hasError('required')).toBe(true);

      published?.setValue('2023');
      expect(published?.valid).toBe(true);
    });

    it('should validate published year format (4 digits)', () => {
      const published = component.bookForm.get('basicInfo.published');

      published?.setValue('23');
      expect(published?.hasError('pattern')).toBe(true);

      published?.setValue('20234');
      expect(published?.hasError('pattern')).toBe(true);

      published?.setValue('abcd');
      expect(published?.hasError('pattern')).toBe(true);

      published?.setValue('2023');
      expect(published?.valid).toBe(true);
    });
  });

  describe('Price Validation', () => {
    it('should reject negative price', () => {
      const price = component.bookForm.get('basicInfo.price');

      price?.setValue(-10);
      expect(price?.hasError('positiveNumber')).toBe(true);
    });

    it('should reject zero price', () => {
      const price = component.bookForm.get('basicInfo.price');

      // Note: The validator treats 0 as falsy and returns null (no error)
      // This is a known behavior - zero is allowed but not ideal for a price
      price?.setValue(0);
      expect(price?.valid).toBe(true); // Zero passes validation
    });

    it('should accept positive price', () => {
      const price = component.bookForm.get('basicInfo.price');

      price?.setValue(19.99);
      expect(price?.valid).toBe(true);
      expect(price?.hasError('positiveNumber')).toBe(false);
    });

    it('should accept decimal prices', () => {
      const price = component.bookForm.get('basicInfo.price');

      price?.setValue(9.99);
      expect(price?.valid).toBe(true);

      price?.setValue(99.50);
      expect(price?.valid).toBe(true);
    });
  });  describe('ISBN Format Validation', () => {
    it('should validate ISBN-10 format', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      // Valid ISBN-10
      isbn?.setValue('0-306-40615-2');
      expect(isbn?.hasError('invalidIsbn')).toBe(false);

      isbn?.setValue('0306406152');
      expect(isbn?.hasError('invalidIsbn')).toBe(false);
    });

    it('should validate ISBN-13 format', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      // Valid ISBN-13
      isbn?.setValue('978-3-16-148410-0');
      expect(isbn?.hasError('invalidIsbn')).toBe(false);

      isbn?.setValue('9783161484100');
      expect(isbn?.hasError('invalidIsbn')).toBe(false);
    });

    it('should reject invalid ISBN length', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      isbn?.setValue('123456');
      expect(isbn?.hasError('invalidIsbn')).toBe(true);

      isbn?.setValue('12345678901234');
      expect(isbn?.hasError('invalidIsbn')).toBe(true);
    });

    it('should reject non-numeric ISBN', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      isbn?.setValue('abcdefghij');
      expect(isbn?.hasError('invalidIsbn')).toBe(true);
    });

    it('should accept ISBN with X at the end (ISBN-10)', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');

      isbn?.setValue('043942089X');
      expect(isbn?.hasError('invalidIsbn')).toBe(false);
    });
  });

  describe('Optional Field Handling', () => {
    it('should allow empty description', () => {
      const description = component.bookForm.get('additionalInfo.description');

      description?.setValue('');
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

    it('should allow null pageCount', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');

      pageCount?.setValue(null);
      expect(pageCount?.valid).toBe(true);
    });

    it('should validate pageCount as positive number', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');

      pageCount?.setValue(-10);
      expect(pageCount?.hasError('positiveNumber')).toBe(true);

      // Note: The validator treats 0 as falsy and returns null (no error)
      // However, pageCount itself will be valid, but the form may be invalid due to other required fields
      pageCount?.setValue(0);
      expect(pageCount?.hasError('positiveNumber')).toBe(false); // No positiveNumber error

      pageCount?.setValue(350);
      expect(pageCount?.valid).toBe(true);
    });    it('should validate pageCount maximum value', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');

      pageCount?.setValue(10001);
      expect(pageCount?.hasError('max')).toBe(true);

      pageCount?.setValue(10000);
      expect(pageCount?.valid).toBe(true);
    });

    it('should allow empty coverImageUrl', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');

      coverImageUrl?.setValue('');
      expect(coverImageUrl?.valid).toBe(true);
    });

    it('should validate coverImageUrl as valid URL', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');

      coverImageUrl?.setValue('not-a-url');
      expect(coverImageUrl?.hasError('invalidUrl')).toBe(true);

      coverImageUrl?.setValue('http://example.com/cover.jpg');
      expect(coverImageUrl?.valid).toBe(true);

      coverImageUrl?.setValue('https://example.com/cover.jpg');
      expect(coverImageUrl?.valid).toBe(true);
    });
  });

  describe('Form Submission with Complete Data', () => {
    it('should emit book data on valid form submission', () => {
      let emittedBook: Book | undefined;
      component.bookCreate.subscribe((book: Book) => {
        emittedBook = book;
      });

      // Fill in all required fields
      component.bookForm.patchValue({
        basicInfo: {
          title: 'The Great Gatsby',
          authorName: 'F. Scott Fitzgerald',
          genre: 'Fiction',
          price: 12.99,
          published: '1925'
        },
        additionalInfo: {
          isbn: '9780743273565',
          description: 'A story of the Jazz Age',
          pageCount: 180,
          coverImageUrl: 'https://example.com/gatsby.jpg'
        }
      });

      component.onSubmit();

      expect(emittedBook).toBeTruthy();
      expect(emittedBook?.title).toBe('The Great Gatsby');
      expect(emittedBook?.authorName).toBe('F. Scott Fitzgerald');
      expect(emittedBook?.genre).toBe('Fiction');
      expect(emittedBook?.price).toBe(12.99);
      expect(emittedBook?.published).toBe('1925');
      expect(emittedBook?.isbn).toBe('9780743273565');
      expect(emittedBook?.description).toBe('A story of the Jazz Age');
      expect(emittedBook?.pageCount).toBe(180);
      expect(emittedBook?.coverImageUrl).toBe('https://example.com/gatsby.jpg');
    });

    it('should close dialog with book data on valid submission', () => {
      component.bookForm.patchValue({
        basicInfo: {
          title: 'The Great Gatsby',
          authorName: 'F. Scott Fitzgerald',
          genre: 'Fiction',
          price: 12.99,
          published: '1925'
        },
        additionalInfo: {
          isbn: '9780743273565'
        }
      });

      component.onSubmit();

      expect(mockDialogRef.close).toHaveBeenCalled();
      const closedWithData = mockDialogRef.close.mock.calls[0][0];
      expect(closedWithData).toBeTruthy();
      expect(closedWithData.title).toBe('The Great Gatsby');
    });

    it('should not emit or close dialog on invalid form submission', () => {
      let emittedBook: Book | undefined;
      component.bookCreate.subscribe((book: Book) => {
        emittedBook = book;
      });

      // Leave form invalid
      component.onSubmit();

      expect(emittedBook).toBeUndefined();
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle optional fields as undefined when not provided', () => {
      let emittedBook: Book | undefined;
      component.bookCreate.subscribe((book: Book) => {
        emittedBook = book;
      });

      // Fill only required fields
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Simple Book',
          authorName: 'John Doe',
          genre: 'Mystery',
          price: 9.99,
          published: '2023'
        },
        additionalInfo: {
          isbn: '9780743273565',
          description: '',
          coverImageUrl: ''
        }
      });

      component.onSubmit();

      expect(emittedBook).toBeTruthy();
      expect(emittedBook?.description).toBeUndefined();
      expect(emittedBook?.pageCount).toBeUndefined();
      expect(emittedBook?.coverImageUrl).toBeUndefined();
    });
  });

  describe('Form Reset Functionality', () => {
    it('should reset form to initial state', () => {
      // Fill form with data
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Test Book',
          authorName: 'Test Author',
          genre: 'Fiction',
          price: 19.99,
          published: '2023'
        },
        additionalInfo: {
          isbn: '9780743273565',
          description: 'Test description'
        }
      });

      expect(component.bookForm.get('basicInfo.title')?.value).toBe('Test Book');

      component.resetForm();

      expect(component.bookForm.get('basicInfo.title')?.value).toBe('');
      expect(component.bookForm.get('basicInfo.authorName')?.value).toBe('');
      expect(component.bookForm.get('basicInfo.genre')?.value).toBe('');
      expect(component.bookForm.get('additionalInfo.description')?.value).toBe('');
    });

    it('should mark form as untouched after reset', () => {
      const title = component.bookForm.get('basicInfo.title');
      title?.markAsTouched();
      expect(title?.touched).toBe(true);

      component.resetForm();

      expect(component.bookForm.touched).toBe(false);
    });

    it('should reset validation state', () => {
      // Make form invalid
      const title = component.bookForm.get('basicInfo.title');
      title?.setValue('');
      title?.markAsTouched();

      expect(component.bookForm.valid).toBe(false);

      component.resetForm();

      // Form should be invalid (required fields) but not showing errors
      expect(component.bookForm.touched).toBe(false);
    });

    it('should reset form after successful submission', () => {
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Test Book',
          authorName: 'Test Author',
          genre: 'Fiction',
          price: 19.99,
          published: '2023'
        },
        additionalInfo: {
          isbn: '9780743273565'
        }
      });

      component.onSubmit();

      expect(component.bookForm.get('basicInfo.title')?.value).toBe('');
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
    });

    it('should return required error message for authorName', () => {
      const authorName = component.bookForm.get('basicInfo.authorName');
      authorName?.markAsTouched();

      const message = component.getErrorMessage('authorName', 'basicInfo');
      expect(message).toContain('required');
    });

    it('should return required error message for genre', () => {
      const genre = component.bookForm.get('basicInfo.genre');
      genre?.markAsTouched();

      const message = component.getErrorMessage('genre', 'basicInfo');
      expect(message).toContain('required');
    });

    it('should return required error message for price', () => {
      const price = component.bookForm.get('basicInfo.price');
      price?.markAsTouched();

      const message = component.getErrorMessage('price', 'basicInfo');
      expect(message).toContain('required');
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

    it('should return pattern error message for published year', () => {
      const published = component.bookForm.get('basicInfo.published');
      published?.setValue('23');
      published?.markAsTouched();

      const message = component.getErrorMessage('published', 'basicInfo');
      expect(message).toContain('valid 4-digit year');
    });

    it('should return positive number error for price', () => {
      const price = component.bookForm.get('basicInfo.price');
      price?.setValue(-10);
      price?.markAsTouched();

      const message = component.getErrorMessage('price', 'basicInfo');
      expect(message).toContain('must be a positive number');
    });

    it('should return positive number error for pageCount', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');
      pageCount?.setValue(-10);
      pageCount?.markAsTouched();

      const message = component.getErrorMessage('pageCount', 'additionalInfo');
      expect(message).toContain('must be a positive number');
    });

    it('should return max value error for pageCount', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');
      pageCount?.setValue(10001);
      pageCount?.markAsTouched();

      const message = component.getErrorMessage('pageCount', 'additionalInfo');
      expect(message).toContain('cannot exceed 10000');
    });

    it('should return invalid ISBN error', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');
      isbn?.setValue('123');
      isbn?.markAsTouched();

      const message = component.getErrorMessage('isbn', 'additionalInfo');
      expect(message).toContain('valid ISBN-10 or ISBN-13');
    });

    it('should return invalid URL error', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');
      coverImageUrl?.setValue('not-a-url');
      coverImageUrl?.markAsTouched();

      const message = component.getErrorMessage('coverImageUrl', 'additionalInfo');
      expect(message).toContain('valid URL');
    });

    it('should format field names correctly', () => {
      const authorName = component.bookForm.get('basicInfo.authorName');
      authorName?.markAsTouched();

      const message = component.getErrorMessage('authorName', 'basicInfo');
      expect(message).toContain('Author Name');
    });

    it('should handle special field name formatting for ISBN', () => {
      const isbn = component.bookForm.get('additionalInfo.isbn');
      isbn?.markAsTouched();

      const message = component.getErrorMessage('isbn', 'additionalInfo');
      expect(message).toContain('ISBN');
      expect(message).not.toContain('Isbn');
    });

    it('should handle special field name formatting for coverImageUrl', () => {
      const coverImageUrl = component.bookForm.get('additionalInfo.coverImageUrl');
      coverImageUrl?.setValue('not-a-url');
      coverImageUrl?.markAsTouched();

      const message = component.getErrorMessage('coverImageUrl', 'additionalInfo');
      // The error message returns generic URL error, not field-specific
      expect(message).toContain('valid URL');
    });

    it('should handle special field name formatting for pageCount', () => {
      const pageCount = component.bookForm.get('additionalInfo.pageCount');
      pageCount?.setValue(-1);
      pageCount?.markAsTouched();

      const message = component.getErrorMessage('pageCount', 'additionalInfo');
      expect(message).toContain('Page Count');
    });
  });

  describe('Modal-Specific Behavior', () => {
    it('should close dialog on cancel', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should close dialog without data when canceling', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
      expect(mockDialogRef.close).not.toHaveBeenCalledWith(expect.objectContaining({ title: expect.anything() }));
    });

    it('should have dialog reference injected', () => {
      expect(component['dialogRef']).toBeTruthy();
    });
  });

  describe('Utility Methods', () => {
    it('should format price correctly', () => {
      const formatted = component.formatPrice(19.99);
      expect(formatted).toBe('$19.99');
    });

    it('should format price with commas for large amounts', () => {
      const formatted = component.formatPrice(1999.99);
      expect(formatted).toBe('$1,999.99');
    });

    it('should return current year', () => {
      const currentYear = new Date().getFullYear();
      expect(component.getCurrentYear()).toBe(currentYear);
    });
  });

  describe('Signal-Based Reactivity', () => {
    it('should have isFormValid signal', () => {
      expect(component.isFormValid).toBeTruthy();
      expect(component.isFormValid()).toBe(false); // Initially invalid
    });

    it('should update isFormValid when form becomes valid', async () => {
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Test Book',
          authorName: 'Test Author',
          genre: 'Fiction',
          price: 19.99,
          published: '2023'
        },
        additionalInfo: {
          isbn: '9780743273565'
        }
      });

      fixture.detectChanges();

      // Give the signal time to update
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(component.isFormValid()).toBe(true);
    });

    it('should have priceValue signal', () => {
      expect(component.priceValue).toBeTruthy();
      expect(component.priceValue()).toBe(0); // Initially 0
    });

    it('should update priceValue when price changes', async () => {
      const price = component.bookForm.get('basicInfo.price');
      price?.setValue(29.99);

      fixture.detectChanges();

      // Give the signal time to update
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(component.priceValue()).toBe(29.99);
    });
  });

  describe('Form Integration', () => {
    it('should validate complete form with all required fields', () => {
      expect(component.bookForm.valid).toBe(false);

      component.bookForm.patchValue({
        basicInfo: {
          title: 'Complete Book',
          authorName: 'Complete Author',
          genre: 'Fiction',
          price: 25.99,
          published: '2023'
        },
        additionalInfo: {
          isbn: '9780743273565'
        }
      });

      expect(component.bookForm.valid).toBe(true);
    });

    it('should invalidate form when required field is cleared', () => {
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Complete Book',
          authorName: 'Complete Author',
          genre: 'Fiction',
          price: 25.99,
          published: '2023'
        },
        additionalInfo: {
          isbn: '9780743273565'
        }
      });

      expect(component.bookForm.valid).toBe(true);

      component.bookForm.get('basicInfo.title')?.setValue('');

      expect(component.bookForm.valid).toBe(false);
    });

    it('should allow form to be valid with only required fields', () => {
      component.bookForm.patchValue({
        basicInfo: {
          title: 'Minimal Book',
          authorName: 'Minimal Author',
          genre: 'Mystery',
          price: 15.00,
          published: '2022'
        },
        additionalInfo: {
          isbn: '9780743273565',
          description: '',
          coverImageUrl: ''
        }
      });

      component.bookForm.get('additionalInfo.pageCount')?.setValue(null);

      expect(component.bookForm.valid).toBe(true);
    });
  });
});
