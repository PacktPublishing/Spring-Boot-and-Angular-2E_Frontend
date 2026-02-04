import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookForm } from './book-form';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { Book } from '../../../../shared/models/book';

describe('BookForm', () => {
  let component: BookForm;
  let fixture: ComponentFixture<BookForm>;
  let mockBookStore: {
    books: ReturnType<typeof signal<Book[]>>;
    addBook: ReturnType<typeof vi.fn>;
    updateBook: ReturnType<typeof vi.fn>;
  };
  let mockActivatedRoute: {
    snapshot: {
      paramMap: {
        get: ReturnType<typeof vi.fn>;
      };
    };
  };

  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Test Book',
      authorName: 'Test Author',
      genre: 'Programming',
      price: 29.99,
      published: '2024-01-15',
      isbn: '1234567890'
    },
    {
      id: '2',
      title: 'Another Book',
      authorName: 'Another Author',
      genre: 'Fiction',
      price: 19.99,
      published: '2023-06-20',
      isbn: '0987654321'
    }
  ];

  beforeEach(async () => {
    // Create mock store with signal
    mockBookStore = {
      books: signal<Book[]>([]),
      addBook: vi.fn(),
      updateBook: vi.fn()
    };

    // Create mock activated route
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [BookForm],
      providers: [
        provideRouter([]),
        provideNativeDateAdapter(),
        { provide: 'BookStore', useValue: mockBookStore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    // Inject the BookStore manually
    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(BookForm);
      component = fixture.componentInstance;

      // Override the injected store with our mock
      (component as any).store = mockBookStore;
    });
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize form with all required fields', () => {
      fixture.detectChanges();

      expect(component.bookForm).toBeTruthy();
      expect(component.bookForm.get('title')).toBeTruthy();
      expect(component.bookForm.get('authorName')).toBeTruthy();
      expect(component.bookForm.get('genre')).toBeTruthy();
      expect(component.bookForm.get('price')).toBeTruthy();
      expect(component.bookForm.get('published')).toBeTruthy();
      expect(component.bookForm.get('isbn')).toBeTruthy();
    });

    it('should initialize with invalid form', () => {
      fixture.detectChanges();
      expect(component.bookForm.valid).toBe(false);
    });

    it('should initialize in create mode by default', () => {
      fixture.detectChanges();
      expect(component.isEditMode).toBe(false);
      expect(component.bookId).toBeNull();
    });

    it('should have available genres list', () => {
      fixture.detectChanges();
      expect(component.availableGenres).toBeTruthy();
      expect(component.availableGenres.length).toBeGreaterThan(0);
      expect(component.availableGenres).toContain('Programming');
      expect(component.availableGenres).toContain('Fiction');
    });
  });

  describe('Edit Mode Initialization', () => {
    beforeEach(() => {
      mockBookStore.books.set(mockBooks);
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
    });

    it('should detect edit mode when id is present in route', () => {
      fixture.detectChanges();
      expect(component.isEditMode).toBe(true);
      expect(component.bookId).toBe('1');
    });

it('should load book data in edit mode', async () => {
      fixture.detectChanges();

      // Wait for async loading
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(component.bookForm.get('title')?.value).toBe('Test Book');
      expect(component.bookForm.get('authorName')?.value).toBe('Test Author');
      expect(component.bookForm.get('genre')?.value).toBe('Programming');
      expect(component.bookForm.get('price')?.value).toBe(29.99);
      expect(component.bookForm.get('isbn')?.value).toBe('1234567890');
    });

it('should convert published date string to Date object', async () => {
      fixture.detectChanges();

      // Wait for async loading
      await new Promise(resolve => setTimeout(resolve, 150));

      const publishedValue = component.bookForm.get('published')?.value;
      expect(publishedValue).toBeInstanceOf(Date);
    });

    it('should navigate to books list if book not found', async () => {
      const navigateSpy = vi.spyOn((component as any).router, 'navigate');
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('999');

      fixture.detectChanges();

      // Wait for async loading
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(navigateSpy).toHaveBeenCalledWith(['/books']);
    });
  });

  describe('Form Field Validation - Title', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate title as required', () => {
      const title = component.bookForm.get('title');
      expect(title?.hasError('required')).toBe(true);

      title?.setValue('Valid Title');
      expect(title?.valid).toBe(true);
    });

    it('should validate title minimum length', () => {
      const title = component.bookForm.get('title');

      title?.setValue('AB');
      expect(title?.hasError('minlength')).toBe(true);

      title?.setValue('ABC');
      expect(title?.valid).toBe(true);
    });

    it('should accept titles with 3 or more characters', () => {
      const title = component.bookForm.get('title');
      const validTitles = ['ABC', 'Test Book', 'A Very Long Book Title'];

      validTitles.forEach(validTitle => {
        title?.setValue(validTitle);
        expect(title?.valid).toBe(true);
      });
    });
  });

  describe('Form Field Validation - Author Name', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate authorName as required', () => {
      const authorName = component.bookForm.get('authorName');
      expect(authorName?.hasError('required')).toBe(true);

      authorName?.setValue('John Doe');
      expect(authorName?.valid).toBe(true);
    });

    it('should validate authorName minimum length', () => {
      const authorName = component.bookForm.get('authorName');

      authorName?.setValue('AB');
      expect(authorName?.hasError('minlength')).toBe(true);

      authorName?.setValue('ABC');
      expect(authorName?.valid).toBe(true);
    });

    it('should accept author names with 3 or more characters', () => {
      const authorName = component.bookForm.get('authorName');
      const validAuthors = ['ABC', 'John Doe', 'J.R.R. Tolkien'];

      validAuthors.forEach(author => {
        authorName?.setValue(author);
        expect(authorName?.valid).toBe(true);
      });
    });
  });

  describe('Form Field Validation - Genre', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate genre as required', () => {
      const genre = component.bookForm.get('genre');
      expect(genre?.hasError('required')).toBe(true);

      genre?.setValue('Programming');
      expect(genre?.valid).toBe(true);
    });

    it('should accept all available genres', () => {
      const genre = component.bookForm.get('genre');

      component.availableGenres.forEach(genreValue => {
        genre?.setValue(genreValue);
        expect(genre?.valid).toBe(true);
      });
    });
  });

  describe('Form Field Validation - Price', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate price as required', () => {
      const price = component.bookForm.get('price');
      expect(price?.hasError('required')).toBe(true);

      price?.setValue(29.99);
      expect(price?.valid).toBe(true);
    });

    it('should validate price minimum value', () => {
      const price = component.bookForm.get('price');

      price?.setValue(-10);
      expect(price?.hasError('min')).toBe(true);

      price?.setValue(0);
      expect(price?.valid).toBe(true);
    });

    it('should accept valid price values', () => {
      const price = component.bookForm.get('price');
      const validPrices = [0, 10, 29.99, 100.50, 999.99];

      validPrices.forEach(validPrice => {
        price?.setValue(validPrice);
        expect(price?.valid).toBe(true);
      });
    });
  });

  describe('Form Field Validation - Published Date', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate published as required', () => {
      const published = component.bookForm.get('published');
      expect(published?.hasError('required')).toBe(true);

      published?.setValue(new Date('2024-01-15'));
      expect(published?.valid).toBe(true);
    });

    it('should accept Date objects', () => {
      const published = component.bookForm.get('published');
      const validDates = [
        new Date('2024-01-01'),
        new Date('2023-12-31'),
        new Date('2020-06-15')
      ];

      validDates.forEach(date => {
        published?.setValue(date);
        expect(published?.valid).toBe(true);
      });
    });

    it('should accept date strings', () => {
      const published = component.bookForm.get('published');

      published?.setValue('2024-01-15');
      expect(published?.valid).toBe(true);
    });
  });

  describe('Form Field Validation - ISBN', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate isbn as required', () => {
      const isbn = component.bookForm.get('isbn');
      expect(isbn?.hasError('required')).toBe(true);

      isbn?.setValue('1234567890');
      expect(isbn?.valid).toBe(true);
    });

    it('should validate isbn minimum length', () => {
      const isbn = component.bookForm.get('isbn');

      isbn?.setValue('123456789');
      expect(isbn?.hasError('minlength')).toBe(true);

      isbn?.setValue('1234567890');
      expect(isbn?.valid).toBe(true);
    });

    it('should accept valid ISBN formats', () => {
      const isbn = component.bookForm.get('isbn');
      const validISBNs = [
        '1234567890',
        '123-4567890',
        '1234567890123',
        '978-3-16-148410-0'
      ];

      validISBNs.forEach(validISBN => {
        isbn?.setValue(validISBN);
        expect(isbn?.valid).toBe(true);
      });
    });
  });

  describe('Form Submission - Create Mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call addBook when submitting in create mode', () => {
      component.bookForm.patchValue({
        title: 'New Book',
        authorName: 'New Author',
        genre: 'Fiction',
        price: 24.99,
        published: new Date('2024-01-15'),
        isbn: '1234567890'
      });

      component.onSubmit();

      expect(mockBookStore.addBook).toHaveBeenCalled();
      expect(mockBookStore.updateBook).not.toHaveBeenCalled();
    });

    it('should convert Date to ISO string when submitting', () => {
      const testDate = new Date('2024-01-15');
      component.bookForm.patchValue({
        title: 'New Book',
        authorName: 'New Author',
        genre: 'Fiction',
        price: 24.99,
        published: testDate,
        isbn: '1234567890'
      });

      component.onSubmit();

      const callArg = mockBookStore.addBook.mock.calls[0][0];
      expect(callArg.published).toBe('2024-01-15');
    });

    it('should navigate to books list after successful submission', () => {
      const navigateSpy = vi.spyOn((component as any).router, 'navigate');

      component.bookForm.patchValue({
        title: 'New Book',
        authorName: 'New Author',
        genre: 'Fiction',
        price: 24.99,
        published: new Date('2024-01-15'),
        isbn: '1234567890'
      });

      component.onSubmit();

      expect(navigateSpy).toHaveBeenCalledWith(['/books']);
    });

    it('should not submit when form is invalid', () => {
      component.onSubmit();

      expect(mockBookStore.addBook).not.toHaveBeenCalled();
      expect(mockBookStore.updateBook).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      const markAllAsTouchedSpy = vi.spyOn(component.bookForm, 'markAllAsTouched');

      component.onSubmit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Form Submission - Edit Mode', () => {
    beforeEach(() => {
      mockBookStore.books.set(mockBooks);
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
      fixture.detectChanges();
    });

    it('should call updateBook when submitting in edit mode', () => {
      component.bookForm.patchValue({
        title: 'Updated Book',
        authorName: 'Updated Author',
        genre: 'Fiction',
        price: 34.99,
        published: new Date('2024-02-20'),
        isbn: '1234567890'
      });

      component.onSubmit();

      expect(mockBookStore.updateBook).toHaveBeenCalled();
      expect(mockBookStore.addBook).not.toHaveBeenCalled();
    });

    it('should include book id when updating', () => {
      component.bookForm.patchValue({
        title: 'Updated Book',
        authorName: 'Updated Author',
        genre: 'Fiction',
        price: 34.99,
        published: new Date('2024-02-20'),
        isbn: '1234567890'
      });

      component.onSubmit();

      const callArg = mockBookStore.updateBook.mock.calls[0][0];
      expect(callArg.id).toBe('1');
    });

    it('should preserve existing form data when updating', () => {
      component.bookForm.patchValue({
        title: 'Updated Book',
        authorName: 'Updated Author',
        genre: 'Programming',
        price: 34.99,
        published: new Date('2024-02-20'),
        isbn: '1234567890'
      });

      component.onSubmit();

      const callArg = mockBookStore.updateBook.mock.calls[0][0];
      expect(callArg.title).toBe('Updated Book');
      expect(callArg.authorName).toBe('Updated Author');
      expect(callArg.genre).toBe('Programming');
      expect(callArg.price).toBe(34.99);
      expect(callArg.isbn).toBe('1234567890');
    });

    it('should navigate to books list after successful update', () => {
      const navigateSpy = vi.spyOn((component as any).router, 'navigate');

      component.bookForm.patchValue({
        title: 'Updated Book',
        authorName: 'Updated Author',
        genre: 'Fiction',
        price: 34.99,
        published: new Date('2024-02-20'),
        isbn: '1234567890'
      });

      component.onSubmit();

      expect(navigateSpy).toHaveBeenCalledWith(['/books']);
    });
  });

  describe('Cancel Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to books list when cancel is clicked', () => {
      const navigateSpy = vi.spyOn((component as any).router, 'navigate');

      component.onCancel();

      expect(navigateSpy).toHaveBeenCalledWith(['/books']);
    });

    it('should not call addBook or updateBook on cancel', () => {
      component.bookForm.patchValue({
        title: 'Test Book',
        authorName: 'Test Author',
        genre: 'Fiction',
        price: 24.99,
        published: new Date('2024-01-15'),
        isbn: '1234567890'
      });

      component.onCancel();

      expect(mockBookStore.addBook).not.toHaveBeenCalled();
      expect(mockBookStore.updateBook).not.toHaveBeenCalled();
    });
  });

  describe('Error Message Generation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return required error message', () => {
      const title = component.bookForm.get('title');
      title?.markAsTouched();
      title?.setValue('');

      const message = component.getErrorMessage('title');
      expect(message).toContain('required');
    });

    it('should return minlength error message', () => {
      const title = component.bookForm.get('title');
      title?.setValue('AB');
      title?.markAsTouched();

      const message = component.getErrorMessage('title');
      expect(message).toContain('at least 3 characters');
    });

    it('should return min error message for price', () => {
      const price = component.bookForm.get('price');
      price?.setValue(-10);
      price?.markAsTouched();

      const message = component.getErrorMessage('price');
      expect(message).toContain('greater than 0');
    });

    it('should return empty string when no error', () => {
      const title = component.bookForm.get('title');
      title?.setValue('Valid Title');

      const message = component.getErrorMessage('title');
      expect(message).toBe('');
    });

    it('should return error message even for untouched fields', () => {
      // Note: getErrorMessage doesn't check touched state
      const message = component.getErrorMessage('title');
      expect(message).toContain('required');
    });

    it('should generate error messages for all fields', () => {
      const fields = ['title', 'authorName', 'genre', 'price', 'published', 'isbn'];

      fields.forEach(field => {
        const control = component.bookForm.get(field);
        control?.markAsTouched();

        const message = component.getErrorMessage(field);
        expect(message).toBeTruthy();
        expect(message).toContain('required');
      });
    });
  });

  describe('Date Conversion', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should convert Date object to ISO date string', () => {
      const testDate = new Date('2024-01-15T10:30:00Z');
      component.bookForm.patchValue({
        title: 'Test Book',
        authorName: 'Test Author',
        genre: 'Fiction',
        price: 24.99,
        published: testDate,
        isbn: '1234567890'
      });

      component.onSubmit();

      const callArg = mockBookStore.addBook.mock.calls[0][0];
      expect(callArg.published).toBe('2024-01-15');
    });

    it('should preserve string dates as-is', () => {
      component.bookForm.patchValue({
        title: 'Test Book',
        authorName: 'Test Author',
        genre: 'Fiction',
        price: 24.99,
        published: '2024-01-15',
        isbn: '1234567890'
      });

      component.onSubmit();

      const callArg = mockBookStore.addBook.mock.calls[0][0];
      expect(callArg.published).toBe('2024-01-15');
    });
  });

  describe('Form State Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should track form validity', () => {
      expect(component.bookForm.valid).toBe(false);

      component.bookForm.patchValue({
        title: 'Valid Book',
        authorName: 'Valid Author',
        genre: 'Fiction',
        price: 24.99,
        published: new Date('2024-01-15'),
        isbn: '1234567890'
      });

      expect(component.bookForm.valid).toBe(true);
    });

    it('should track form dirty state', () => {
      expect(component.bookForm.dirty).toBe(false);

      // setValue alone doesn't mark as dirty, need markAsDirty or user interaction
      const titleControl = component.bookForm.get('title');
      titleControl?.setValue('Test');
      titleControl?.markAsDirty();

      expect(component.bookForm.dirty).toBe(true);
    });

    it('should track form touched state', () => {
      expect(component.bookForm.touched).toBe(false);

      component.bookForm.get('title')?.markAsTouched();

      expect(component.bookForm.touched).toBe(true);
    });

    it('should update form validity when fields change', () => {
      const title = component.bookForm.get('title');

      expect(component.bookForm.valid).toBe(false);

      // Set all required fields
      component.bookForm.patchValue({
        title: 'Book',
        authorName: 'Author',
        genre: 'Fiction',
        price: 10,
        published: new Date(),
        isbn: '1234567890'
      });

      expect(component.bookForm.valid).toBe(true);

      // Make one field invalid
      title?.setValue('A');
      expect(component.bookForm.valid).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should complete full create workflow', () => {
      const navigateSpy = vi.spyOn((component as any).router, 'navigate');

      // Fill form
      component.bookForm.patchValue({
        title: 'Complete Book',
        authorName: 'Complete Author',
        genre: 'Programming',
        price: 49.99,
        published: new Date('2024-03-01'),
        isbn: '1234567890123'
      });

      // Submit
      component.onSubmit();

      // Verify
      expect(component.bookForm.valid).toBe(true);
      expect(mockBookStore.addBook).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/books']);
    });

    it('should complete full edit workflow', () => {
      mockBookStore.books.set(mockBooks);
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');

      // Reinitialize component
      component.ngOnInit();
      fixture.detectChanges();

      const navigateSpy = vi.spyOn((component as any).router, 'navigate');

      // Modify form
      component.bookForm.patchValue({
        title: 'Modified Book',
        price: 39.99
      });

      // Submit
      component.onSubmit();

      // Verify
      expect(mockBookStore.updateBook).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/books']);
    });

    it('should handle cancel in both modes', () => {
      const navigateSpy = vi.spyOn((component as any).router, 'navigate');

      // Test in create mode
      component.onCancel();
      expect(navigateSpy).toHaveBeenCalledWith(['/books']);

      // Switch to edit mode
      component.isEditMode = true;
      component.bookId = '1';

      // Test in edit mode
      component.onCancel();
      expect(navigateSpy).toHaveBeenCalledWith(['/books']);
    });
  });
});
