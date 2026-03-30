import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { vi } from 'vitest';

import { BookForm } from './book-form';
import { Book } from '../../../../shared/models/book';
import { AuthorStore } from '../../store/author-store/author.store';

const VALID_BOOK_DATA: Book & { id: number } = {
  id: 123,
  title: 'Clean Code',
  isbn: '9780132350884',
  author: { id: 2, name: 'Robert C. Martin', nationality: 'US' },
  price: 29.99,
  genre: 'Technology',
  published: '2008-08-01',
  description: 'A handbook of agile software craftsmanship.',
  pageCount: 431,
  coverImageUrl: 'https://example.com/cover.jpg',
};

function createTestBed(dialogData: unknown) {
  const dialogRefSpy = { close: vi.fn() };
  const authorStoreMock = {
    authors: () => [
      { id: 1, name: 'Jane Doe', nationality: 'US' },
      { id: 2, name: 'Robert C. Martin', nationality: 'US' },
    ],
  };

  return TestBed.configureTestingModule({
    imports: [BookForm],
    providers: [
      { provide: MatDialogRef, useValue: dialogRefSpy },
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
      { provide: AuthorStore, useValue: authorStoreMock },
    ],
  }).compileComponents();
}

describe('BookForm', () => {
  describe('Create Mode (no dialog data)', () => {
    let component: BookForm;
    let fixture: ComponentFixture<BookForm>;
    let dialogRefSpy: { close: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
      await createTestBed(null);
      dialogRefSpy = TestBed.inject(MatDialogRef) as unknown as { close: ReturnType<typeof vi.fn> };

      fixture = TestBed.createComponent(BookForm);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    describe('Form Initialization', () => {
      it('should create the component', () => {
        expect(component).toBeTruthy();
      });

      it('should initialize with an invalid form', () => {
        expect(component.bookForm.valid).toBe(false);
      });

      it('should report isEditMode as false', () => {
        expect(component.isEditMode).toBe(false);
      });

      it('should have all required form controls', () => {
        expect(component.bookForm.get('title')).toBeTruthy();
        expect(component.bookForm.get('isbn')).toBeTruthy();
        expect(component.bookForm.get('authorId')).toBeTruthy();
        expect(component.bookForm.get('price')).toBeTruthy();
        expect(component.bookForm.get('genre')).toBeTruthy();
        expect(component.bookForm.get('published')).toBeTruthy();
      });

      it('should have optional form controls', () => {
        expect(component.bookForm.get('description')).toBeTruthy();
        expect(component.bookForm.get('pageCount')).toBeTruthy();
        expect(component.bookForm.get('coverImageUrl')).toBeTruthy();
      });

      it('should initialize price to 0', () => {
        expect(component.bookForm.get('price')?.value).toBe(0);
      });

      it('should initialize optional text fields as empty strings', () => {
        expect(component.bookForm.get('description')?.value).toBe('');
        expect(component.bookForm.get('coverImageUrl')?.value).toBe('');
      });

      it('should initialize pageCount and published as null', () => {
        expect(component.bookForm.get('pageCount')?.value).toBeNull();
        expect(component.bookForm.get('published')?.value).toBeNull();
      });

      it('should expose isFormValid signal reflecting invalid state', () => {
        expect(component.isFormValid()).toBe(false);
      });

      it('should expose the genres list', () => {
        expect(component.genres.length).toBeGreaterThan(0);
        expect(component.genres).toContain('Technology');
      });
    });

    describe('Required Field Validation', () => {
      it('should mark title as required when empty', () => {
        expect(component.bookForm.get('title')?.hasError('required')).toBe(true);
      });

      it('should mark isbn as required when empty', () => {
        expect(component.bookForm.get('isbn')?.hasError('required')).toBe(true);
      });

      it('should mark authorId as required when empty', () => {
        expect(component.bookForm.get('authorId')?.hasError('required')).toBe(true);
      });

      it('should mark genre as required when empty', () => {
        expect(component.bookForm.get('genre')?.hasError('required')).toBe(true);
      });

      it('should mark published as required when null', () => {
        expect(component.bookForm.get('published')?.hasError('required')).toBe(true);
      });

      it('should clear required error once fields are filled', () => {
        component.bookForm.patchValue({
          title: 'My Book',
          isbn: '9780132350884',
          authorId: 1,
          genre: 'Fiction',
          published: new Date('2020-01-01'),
        });
        expect(component.bookForm.get('title')?.hasError('required')).toBe(false);
        expect(component.bookForm.get('isbn')?.hasError('required')).toBe(false);
        expect(component.bookForm.get('authorId')?.hasError('required')).toBe(false);
        expect(component.bookForm.get('genre')?.hasError('required')).toBe(false);
        expect(component.bookForm.get('published')?.hasError('required')).toBe(false);
      });
    });

    describe('Optional Field Handling', () => {
      it('should be valid without description', () => {
        component.bookForm.patchValue({
          title: 'My Book',
          isbn: '9780132350884',
          authorId: 1,
          price: 9.99,
          genre: 'Fiction',
          published: new Date('2020-01-01'),
        });
        expect(component.bookForm.valid).toBe(true);
      });

      it('should be valid without pageCount', () => {
        component.bookForm.patchValue({
          title: 'My Book',
          isbn: '9780132350884',
          authorId: 1,
          price: 9.99,
          genre: 'Fiction',
          published: new Date('2020-01-01'),
          pageCount: null,
        });
        expect(component.bookForm.valid).toBe(true);
      });

      it('should be valid without coverImageUrl', () => {
        component.bookForm.patchValue({
          title: 'My Book',
          isbn: '9780132350884',
          authorId: 1,
          price: 9.99,
          genre: 'Fiction',
          published: new Date('2020-01-01'),
          coverImageUrl: '',
        });
        expect(component.bookForm.valid).toBe(true);
      });
    });

    describe('Price Validation', () => {
      it('should accept price of 0', () => {
        component.bookForm.get('price')?.setValue(0);
        expect(component.bookForm.get('price')?.hasError('min')).toBe(false);
      });

      it('should accept a positive price', () => {
        component.bookForm.get('price')?.setValue(19.99);
        expect(component.bookForm.get('price')?.hasError('min')).toBe(false);
      });

      it('should reject a negative price', () => {
        component.bookForm.get('price')?.setValue(-1);
        expect(component.bookForm.get('price')?.hasError('min')).toBe(true);
      });
    });

    describe('ISBN Format Validation', () => {
      it('should reject a non-numeric ISBN', () => {
        component.bookForm.get('isbn')?.setValue('NOTANISBN');
        expect(component.bookForm.get('isbn')?.hasError('pattern')).toBe(true);
      });

      it('should reject an ISBN with wrong digit count', () => {
        component.bookForm.get('isbn')?.setValue('12345');
        expect(component.bookForm.get('isbn')?.hasError('pattern')).toBe(true);
      });

      it('should accept a valid 10-digit ISBN', () => {
        component.bookForm.get('isbn')?.setValue('0132350884');
        expect(component.bookForm.get('isbn')?.hasError('pattern')).toBe(false);
      });

      it('should accept a valid 13-digit ISBN', () => {
        component.bookForm.get('isbn')?.setValue('9780132350884');
        expect(component.bookForm.get('isbn')?.hasError('pattern')).toBe(false);
      });

      it('should accept a 10-digit ISBN ending in X', () => {
        component.bookForm.get('isbn')?.setValue('019853453X');
        expect(component.bookForm.get('isbn')?.hasError('pattern')).toBe(false);
      });
    });

    describe('Cover Image URL Validation', () => {
      it('should reject a URL not starting with http/https', () => {
        component.bookForm.get('coverImageUrl')?.setValue('ftp://example.com/img.jpg');
        expect(component.bookForm.get('coverImageUrl')?.hasError('pattern')).toBe(true);
      });

      it('should reject a plain string as URL', () => {
        component.bookForm.get('coverImageUrl')?.setValue('not-a-url');
        expect(component.bookForm.get('coverImageUrl')?.hasError('pattern')).toBe(true);
      });

      it('should accept a valid http URL', () => {
        component.bookForm.get('coverImageUrl')?.setValue('http://example.com/cover.jpg');
        expect(component.bookForm.get('coverImageUrl')?.hasError('pattern')).toBe(false);
      });

      it('should accept a valid https URL', () => {
        component.bookForm.get('coverImageUrl')?.setValue('https://example.com/cover.jpg');
        expect(component.bookForm.get('coverImageUrl')?.hasError('pattern')).toBe(false);
      });

      it('should accept an empty coverImageUrl', () => {
        component.bookForm.get('coverImageUrl')?.setValue('');
        expect(component.bookForm.get('coverImageUrl')?.valid).toBe(true);
      });
    });

    describe('Page Count Validation', () => {
      it('should reject pageCount of 0', () => {
        component.bookForm.get('pageCount')?.setValue(0);
        expect(component.bookForm.get('pageCount')?.hasError('min')).toBe(true);
      });

      it('should reject a negative pageCount', () => {
        component.bookForm.get('pageCount')?.setValue(-5);
        expect(component.bookForm.get('pageCount')?.hasError('min')).toBe(true);
      });

      it('should accept a positive pageCount', () => {
        component.bookForm.get('pageCount')?.setValue(300);
        expect(component.bookForm.get('pageCount')?.hasError('min')).toBe(false);
      });
    });

    describe('Error Messages', () => {
      it('should return empty string for untouched title', () => {
        expect(component.getErrorMessage('title')).toBe('');
      });

      it('should return required error message for touched empty title', () => {
        component.bookForm.get('title')?.markAsTouched();
        expect(component.getErrorMessage('title')).toContain('required');
      });

      it('should return required error message for touched empty authorId', () => {
        component.bookForm.get('authorId')?.markAsTouched();
        expect(component.getErrorMessage('authorId')).toContain('required');
      });

      it('should return required error message for touched empty genre', () => {
        component.bookForm.get('genre')?.markAsTouched();
        expect(component.getErrorMessage('genre')).toContain('required');
      });

      it('should return isbn format error for invalid isbn', () => {
        const isbn = component.bookForm.get('isbn');
        isbn?.setValue('BADISBN');
        isbn?.markAsTouched();
        expect(component.getErrorMessage('isbn')).toContain('ISBN');
      });

      it('should return price min error for negative price', () => {
        const price = component.bookForm.get('price');
        price?.setValue(-5);
        price?.markAsTouched();
        expect(component.getErrorMessage('price')).toContain('0 or greater');
      });

      it('should return pageCount min error for value below 1', () => {
        const pageCount = component.bookForm.get('pageCount');
        pageCount?.setValue(0);
        pageCount?.markAsTouched();
        expect(component.getErrorMessage('pageCount')).toContain('at least 1');
      });

      it('should return coverImageUrl pattern error for invalid URL', () => {
        const coverImageUrl = component.bookForm.get('coverImageUrl');
        coverImageUrl?.setValue('not-a-url');
        coverImageUrl?.markAsTouched();
        expect(component.getErrorMessage('coverImageUrl')).toContain('http');
      });

      it('should return empty string once field is valid and touched', () => {
        const title = component.bookForm.get('title');
        title?.setValue('My Book');
        title?.markAsTouched();
        expect(component.getErrorMessage('title')).toBe('');
      });
    });

    describe('Form Submission - Create Mode', () => {
      it('should close dialog with book data (no id) on valid submit', () => {
        component.bookForm.patchValue({
          title: 'My Book',
          isbn: '9780132350884',
          authorId: 1,
          price: 9.99,
          genre: 'Fiction',
          published: new Date('2020-06-15'),
        });

        component.onSubmit();

        expect(dialogRefSpy.close).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'My Book',
            isbn: '9780132350884',
            authorId: 1,
            price: 9.99,
            genre: 'Fiction',
          }),
        );
      });

      it('should not include id in the payload for create mode', () => {
        component.bookForm.patchValue({
          title: 'My Book',
          isbn: '9780132350884',
          authorId: 1,
          price: 9.99,
          genre: 'Fiction',
          published: new Date('2020-06-15'),
        });

        component.onSubmit();

        const payload = (dialogRefSpy.close.mock.calls[0] as unknown[])[0] as Record<
          string,
          unknown
        >;
        expect('id' in payload).toBe(false);
      });

      it('should include optional description in payload when provided', () => {
        component.bookForm.patchValue({
          title: 'My Book',
          isbn: '9780132350884',
          authorId: 1,
          price: 9.99,
          genre: 'Fiction',
          published: new Date('2020-06-15'),
          description: 'A great book.',
        });

        component.onSubmit();

        expect(dialogRefSpy.close).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'A great book.' }),
        );
      });

      it('should not emit when form is invalid', () => {
        component.onSubmit();
        expect(dialogRefSpy.close).not.toHaveBeenCalled();
      });
    });

    describe('Cancel', () => {
      it('should close dialog without data on cancel', () => {
        component.onCancel();
        expect(dialogRefSpy.close).toHaveBeenCalledWith();
      });
    });
  });

  describe('Edit Mode (with dialog data)', () => {
    let component: BookForm;
    let fixture: ComponentFixture<BookForm>;
    let dialogRefSpy: { close: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
      await createTestBed(VALID_BOOK_DATA);
      dialogRefSpy = TestBed.inject(MatDialogRef) as unknown as { close: ReturnType<typeof vi.fn> };

      fixture = TestBed.createComponent(BookForm);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should report isEditMode as true', () => {
      expect(component.isEditMode).toBe(true);
    });

    it('should pre-populate title from dialog data', () => {
      expect(component.bookForm.get('title')?.value).toBe(VALID_BOOK_DATA.title);
    });

    it('should pre-populate isbn from dialog data', () => {
      expect(component.bookForm.get('isbn')?.value).toBe(VALID_BOOK_DATA.isbn);
    });

    it('should pre-populate authorId from dialog data author name mapping', () => {
      expect(component.bookForm.get('authorId')?.value).toBe(2);
    });

    it('should pre-populate price from dialog data', () => {
      expect(component.bookForm.get('price')?.value).toBe(VALID_BOOK_DATA.price);
    });

    it('should pre-populate genre from dialog data', () => {
      expect(component.bookForm.get('genre')?.value).toBe(VALID_BOOK_DATA.genre);
    });

    it('should pre-populate description from dialog data', () => {
      expect(component.bookForm.get('description')?.value).toBe(VALID_BOOK_DATA.description);
    });

    it('should pre-populate pageCount from dialog data', () => {
      expect(component.bookForm.get('pageCount')?.value).toBe(VALID_BOOK_DATA.pageCount);
    });

    it('should pre-populate coverImageUrl from dialog data', () => {
      expect(component.bookForm.get('coverImageUrl')?.value).toBe(VALID_BOOK_DATA.coverImageUrl);
    });

    it('should initialize the form as valid in edit mode', () => {
      expect(component.bookForm.valid).toBe(true);
    });

    describe('Form Submission - Edit Mode', () => {
      it('should close dialog with id and updated data on valid submit', () => {
        component.onSubmit();

        expect(dialogRefSpy.close).toHaveBeenCalledWith(
          expect.objectContaining({
            id: VALID_BOOK_DATA.id,
            title: VALID_BOOK_DATA.title,
            authorId: 2,
          }),
        );
      });

      it('should include the original id in the edit payload', () => {
        component.onSubmit();

        const payload = (dialogRefSpy.close.mock.calls[0] as unknown[])[0] as Record<
          string,
          unknown
        >;
        expect(payload['id']).toBe(VALID_BOOK_DATA.id);
      });

      it('should reflect updated title in the payload', () => {
        component.bookForm.get('title')?.setValue('Updated Title');
        component.onSubmit();

        expect(dialogRefSpy.close).toHaveBeenCalledWith(
          expect.objectContaining({ id: VALID_BOOK_DATA.id, title: 'Updated Title' }),
        );
      });
    });

    describe('Cancel in Edit Mode', () => {
      it('should close dialog without data on cancel', () => {
        component.onCancel();
        expect(dialogRefSpy.close).toHaveBeenCalledWith();
      });
    });
  });
});
