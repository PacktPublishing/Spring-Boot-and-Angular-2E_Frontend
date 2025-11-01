import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BookForm } from './book-form';
import { BookStore } from '../../store/book.store';
import { Book } from '../../../../shared/models/book';
import { vi } from 'vitest';
import { signal } from '@angular/core';

describe('BookForm', () => {
  let component: BookForm;
  let fixture: ComponentFixture<BookForm>;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: { snapshot: { paramMap: { get: ReturnType<typeof vi.fn> } } };
  let mockBookStore: {
    books: ReturnType<typeof signal>;
    addBook: ReturnType<typeof vi.fn>;
    updateBook: ReturnType<typeof vi.fn>;
  };

  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'The Great Gatsby',
      authorName: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      price: 12.99,
      published: '1925-01-01',
      isbn: '9780743273565',
      description: 'A story of the Jazz Age',
      pageCount: 180,
      coverImageUrl: 'https://example.com/gatsby.jpg'
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      authorName: 'Harper Lee',
      genre: 'Fiction',
      price: 14.99,
      published: '1960-01-01',
      isbn: '9780061120084'
    }
  ];

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn()
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(null)
        }
      }
    };

    mockBookStore = {
      books: signal(mockBooks),
      addBook: vi.fn(),
      updateBook: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BookForm],
      providers: [
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: BookStore,
          useValue: mockBookStore
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookForm);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with create mode when no id is provided', () => {
      fixture.detectChanges();
      expect(component.isEditMode).toBe(false);
      expect(component.bookId).toBeNull();
    });

    it('should initialize with edit mode when id is provided', () => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
      component.ngOnInit();
      expect(component.isEditMode).toBe(true);
      expect(component.bookId).toBe('1');
    });

    it('should initialize form with all required controls', () => {
      fixture.detectChanges();
      expect(component.bookForm.get('title')).toBeTruthy();
      expect(component.bookForm.get('authorName')).toBeTruthy();
      expect(component.bookForm.get('genre')).toBeTruthy();
      expect(component.bookForm.get('price')).toBeTruthy();
      expect(component.bookForm.get('published')).toBeTruthy();
      expect(component.bookForm.get('isbn')).toBeTruthy();
    });

    it('should have predefined genres list', () => {
      fixture.detectChanges();
      expect(component.availableGenres).toBeTruthy();
      expect(component.availableGenres.length).toBeGreaterThan(0);
      expect(component.availableGenres).toContain('Programming');
      expect(component.availableGenres).toContain('Fiction');
      expect(component.availableGenres).toContain('Mystery');
    });

    it('should initialize form as invalid', () => {
      fixture.detectChanges();
      expect(component.bookForm.valid).toBe(false);
    });
  });

  describe('Form Validation - Title', () => {
    it('should validate title as required', () => {
      fixture.detectChanges();
      const title = component.bookForm.get('title');
      expect(title?.hasError('required')).toBe(true);

      title?.setValue('The Great Gatsby');
      expect(title?.valid).toBe(true);
    });

    it('should validate title minimum length', () => {
      fixture.detectChanges();
      const title = component.bookForm.get('title');

      title?.setValue('AB');
      expect(title?.hasError('minlength')).toBe(true);

      title?.setValue('ABC');
      expect(title?.valid).toBe(true);
    });
  });

  describe('Form Validation - Author Name', () => {
    it('should validate authorName as required', () => {
      fixture.detectChanges();
      const authorName = component.bookForm.get('authorName');
      expect(authorName?.hasError('required')).toBe(true);

      authorName?.setValue('F. Scott Fitzgerald');
      expect(authorName?.valid).toBe(true);
    });

    it('should validate authorName minimum length', () => {
      fixture.detectChanges();
      const authorName = component.bookForm.get('authorName');

      authorName?.setValue('AB');
      expect(authorName?.hasError('minlength')).toBe(true);

      authorName?.setValue('ABC');
      expect(authorName?.valid).toBe(true);
    });
  });

  describe('Form Validation - Genre', () => {
    it('should validate genre as required', () => {
      fixture.detectChanges();
      const genre = component.bookForm.get('genre');
      expect(genre?.hasError('required')).toBe(true);

      genre?.setValue('Fiction');
      expect(genre?.valid).toBe(true);
    });
  });

  describe('Form Validation - Price', () => {
    it('should validate price as required', () => {
      fixture.detectChanges();
      const price = component.bookForm.get('price');
      expect(price?.hasError('required')).toBe(true);

      price?.setValue(19.99);
      expect(price?.valid).toBe(true);
    });

    it('should reject negative price', () => {
      fixture.detectChanges();
      const price = component.bookForm.get('price');

      price?.setValue(-10);
      expect(price?.hasError('min')).toBe(true);
    });

    it('should accept zero price', () => {
      fixture.detectChanges();
      const price = component.bookForm.get('price');

      price?.setValue(0);
      expect(price?.valid).toBe(true);
    });

    it('should accept positive price', () => {
      fixture.detectChanges();
      const price = component.bookForm.get('price');

      price?.setValue(19.99);
      expect(price?.valid).toBe(true);
    });

    it('should accept decimal prices', () => {
      fixture.detectChanges();
      const price = component.bookForm.get('price');

      price?.setValue(9.99);
      expect(price?.valid).toBe(true);

      price?.setValue(99.50);
      expect(price?.valid).toBe(true);
    });
  });

  describe('Form Validation - Published', () => {
    it('should validate published as required', () => {
      fixture.detectChanges();
      const published = component.bookForm.get('published');
      expect(published?.hasError('required')).toBe(true);

      published?.setValue('2023-01-01');
      expect(published?.valid).toBe(true);
    });
  });

  describe('Form Validation - ISBN', () => {
    it('should validate isbn as required', () => {
      fixture.detectChanges();
      const isbn = component.bookForm.get('isbn');
      expect(isbn?.hasError('required')).toBe(true);

      isbn?.setValue('9780743273565');
      expect(isbn?.valid).toBe(true);
    });

    it('should validate isbn minimum length', () => {
      fixture.detectChanges();
      const isbn = component.bookForm.get('isbn');

      isbn?.setValue('123456789');
      expect(isbn?.hasError('minlength')).toBe(true);

      isbn?.setValue('0306406152');
      expect(isbn?.valid).toBe(true);
    });
  });

  describe('Form Submission - Create Mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not submit invalid form', () => {
      component.onSubmit();

      expect(mockBookStore.addBook).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should call addBook when form is valid in create mode', () => {
      component.bookForm.patchValue({
        title: 'New Book',
        authorName: 'New Author',
        genre: 'Fiction',
        price: 19.99,
        published: '2023-01-01',
        isbn: '9780743273565'
      });

      component.onSubmit();

      expect(mockBookStore.addBook).toHaveBeenCalled();
      const addedBook = mockBookStore.addBook.mock.calls[0][0];
      expect(addedBook.title).toBe('New Book');
      expect(addedBook.authorName).toBe('New Author');
    });

    it('should navigate to books page after successful creation', () => {
      component.bookForm.patchValue({
        title: 'New Book',
        authorName: 'New Author',
        genre: 'Fiction',
        price: 19.99,
        published: '2023-01-01',
        isbn: '9780743273565'
      });

      component.onSubmit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/books']);
    });

    it('should handle Date object for published field', () => {
      const testDate = new Date('2023-01-15');
      component.bookForm.patchValue({
        title: 'New Book',
        authorName: 'New Author',
        genre: 'Fiction',
        price: 19.99,
        published: testDate,
        isbn: '9780743273565'
      });

      component.onSubmit();

      const addedBook = mockBookStore.addBook.mock.calls[0][0];
      expect(addedBook.published).toBe('2023-01-15');
    });

    it('should mark all fields as touched when form is invalid on submission', () => {
      component.onSubmit();

      expect(component.bookForm.touched).toBe(true);
    });
  });

  describe('Form Submission - Edit Mode', () => {
    beforeEach(() => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call updateBook when form is valid in edit mode', () => {
      component.bookForm.patchValue({
        title: 'Updated Title',
        authorName: 'Updated Author',
        genre: 'Mystery',
        price: 15.99,
        published: '2020-01-01',
        isbn: '9780743273565'
      });

      component.onSubmit();

      expect(mockBookStore.updateBook).toHaveBeenCalled();
      const updatedBook = mockBookStore.updateBook.mock.calls[0][0];
      expect(updatedBook.id).toBe('1');
      expect(updatedBook.title).toBe('Updated Title');
    });

    it('should navigate to books page after successful update', () => {
      component.bookForm.patchValue({
        title: 'Updated Title',
        authorName: 'Updated Author',
        genre: 'Mystery',
        price: 15.99,
        published: '2020-01-01',
        isbn: '9780743273565'
      });

      component.onSubmit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/books']);
    });

    it('should not call addBook in edit mode', () => {
      component.bookForm.patchValue({
        title: 'Updated Title',
        authorName: 'Updated Author',
        genre: 'Mystery',
        price: 15.99,
        published: '2020-01-01',
        isbn: '9780743273565'
      });

      component.onSubmit();

      expect(mockBookStore.addBook).not.toHaveBeenCalled();
    });
  });

  describe('Loading Book Data in Edit Mode', () => {
    it('should load book data from store when in edit mode', async () => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
      component.ngOnInit();

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(component.bookForm.get('title')?.value).toBe('The Great Gatsby');
      expect(component.bookForm.get('authorName')?.value).toBe('F. Scott Fitzgerald');
      expect(component.bookForm.get('genre')?.value).toBe('Fiction');
      expect(component.bookForm.get('price')?.value).toBe(12.99);
      expect(component.bookForm.get('isbn')?.value).toBe('9780743273565');
    });

    it('should convert published string to Date object in form', async () => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
      component.ngOnInit();

      await new Promise(resolve => setTimeout(resolve, 150));

      const publishedValue = component.bookForm.get('published')?.value;
      expect(publishedValue instanceof Date).toBe(true);
    });

    it('should navigate to books page if book is not found', async () => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('999');
      component.ngOnInit();

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/books']);
    });

    it('should handle empty store by waiting for data', async () => {
      mockBookStore.books = signal([]);
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');

      component.ngOnInit();

      await new Promise(resolve => setTimeout(resolve, 150));

      // Should attempt to find book even if store was empty initially
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/books']);
    });

    it('should load book data immediately if store already has books', () => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');

      component.ngOnInit();

      expect(component.bookForm.get('title')?.value).toBe('The Great Gatsby');
    });
  });

  describe('Cancel Functionality', () => {
    it('should navigate to books page on cancel', () => {
      fixture.detectChanges();
      component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/books']);
    });

    it('should not save any data when canceling', () => {
      fixture.detectChanges();
      component.bookForm.patchValue({
        title: 'Unsaved Book',
        authorName: 'Unsaved Author',
        genre: 'Fiction',
        price: 19.99,
        published: '2023-01-01',
        isbn: '9780743273565'
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

    it('should return error message even for untouched fields', () => {
      const message = component.getErrorMessage('title');
      // The getErrorMessage method returns the error without checking if touched
      expect(message).toContain('required');
    });

    it('should return required error message for title', () => {
      const title = component.bookForm.get('title');
      title?.markAsTouched();

      const message = component.getErrorMessage('title');
      expect(message).toContain('required');
    });

    it('should return required error message for authorName', () => {
      const authorName = component.bookForm.get('authorName');
      authorName?.markAsTouched();

      const message = component.getErrorMessage('authorName');
      expect(message).toContain('required');
    });

    it('should return required error message for genre', () => {
      const genre = component.bookForm.get('genre');
      genre?.markAsTouched();

      const message = component.getErrorMessage('genre');
      expect(message).toContain('required');
    });

    it('should return required error message for price', () => {
      const price = component.bookForm.get('price');
      price?.markAsTouched();

      const message = component.getErrorMessage('price');
      expect(message).toContain('required');
    });

    it('should return required error message for published', () => {
      const published = component.bookForm.get('published');
      published?.markAsTouched();

      const message = component.getErrorMessage('published');
      expect(message).toContain('required');
    });

    it('should return required error message for isbn', () => {
      const isbn = component.bookForm.get('isbn');
      isbn?.markAsTouched();

      const message = component.getErrorMessage('isbn');
      expect(message).toContain('required');
    });

    it('should return minlength error message for title', () => {
      const title = component.bookForm.get('title');
      title?.setValue('AB');
      title?.markAsTouched();

      const message = component.getErrorMessage('title');
      expect(message).toContain('at least 3 characters');
    });

    it('should return minlength error message for authorName', () => {
      const authorName = component.bookForm.get('authorName');
      authorName?.setValue('AB');
      authorName?.markAsTouched();

      const message = component.getErrorMessage('authorName');
      expect(message).toContain('at least 3 characters');
    });

    it('should return minlength error message for isbn', () => {
      const isbn = component.bookForm.get('isbn');
      isbn?.setValue('123456789');
      isbn?.markAsTouched();

      const message = component.getErrorMessage('isbn');
      expect(message).toContain('at least 10 characters');
    });

    it('should return min error message for price', () => {
      const price = component.bookForm.get('price');
      price?.setValue(-10);
      price?.markAsTouched();

      const message = component.getErrorMessage('price');
      expect(message).toContain('greater than 0');
    });

    it('should format field names correctly in error messages', () => {
      const authorName = component.bookForm.get('authorName');
      authorName?.markAsTouched();

      const message = component.getErrorMessage('authorName');
      expect(message).toContain('authorName');
    });
  });

  describe('Form Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate complete form with all required fields', () => {
      expect(component.bookForm.valid).toBe(false);

      component.bookForm.patchValue({
        title: 'Complete Book',
        authorName: 'Complete Author',
        genre: 'Fiction',
        price: 25.99,
        published: '2023-01-01',
        isbn: '9780743273565'
      });

      expect(component.bookForm.valid).toBe(true);
    });

    it('should invalidate form when required field is cleared', () => {
      component.bookForm.patchValue({
        title: 'Complete Book',
        authorName: 'Complete Author',
        genre: 'Fiction',
        price: 25.99,
        published: '2023-01-01',
        isbn: '9780743273565'
      });

      expect(component.bookForm.valid).toBe(true);

      component.bookForm.get('title')?.setValue('');

      expect(component.bookForm.valid).toBe(false);
    });

    it('should allow form to be valid with only required fields', () => {
      component.bookForm.patchValue({
        title: 'Minimal Book',
        authorName: 'Minimal Author',
        genre: 'Mystery',
        price: 15.00,
        published: '2022-01-01',
        isbn: '9780743273565'
      });

      expect(component.bookForm.valid).toBe(true);
    });

    it('should validate price field independently', () => {
      const price = component.bookForm.get('price');

      price?.setValue(19.99);

      expect(price?.valid).toBe(true);
      expect(price?.hasError('required')).toBe(false);
      expect(price?.hasError('min')).toBe(false);
    });
  });

  describe('Create vs Edit Mode Behavior', () => {
    it('should not load book data in create mode', () => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue(null);
      fixture.detectChanges();
      component.ngOnInit();

      expect(component.isEditMode).toBe(false);
      expect(component.bookForm.get('title')?.value).toBe('');
    });

    it('should have different behavior based on isEditMode flag', () => {
      fixture.detectChanges();
      expect(component.isEditMode).toBe(false);

      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('1');
      const newComponent = TestBed.createComponent(BookForm).componentInstance;
      newComponent.ngOnInit();

      expect(newComponent.isEditMode).toBe(true);
    });

    it('should persist bookId in edit mode', () => {
      mockActivatedRoute.snapshot.paramMap.get = vi.fn().mockReturnValue('123');
      component.ngOnInit();

      expect(component.bookId).toBe('123');
      expect(component.isEditMode).toBe(true);
    });
  });

  describe('Date Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle string date format', () => {
      component.bookForm.patchValue({
        published: '2023-01-15'
      });

      expect(component.bookForm.get('published')?.value).toBe('2023-01-15');
    });

    it('should convert Date to ISO string on submission', () => {
      const testDate = new Date('2023-06-15');
      component.bookForm.patchValue({
        title: 'Test Book',
        authorName: 'Test Author',
        genre: 'Fiction',
        price: 19.99,
        published: testDate,
        isbn: '9780743273565'
      });

      component.onSubmit();

      const addedBook = mockBookStore.addBook.mock.calls[0][0];
      expect(addedBook.published).toMatch(/2023-06-15/);
    });

    it('should preserve string date on submission if already string', () => {
      component.bookForm.patchValue({
        title: 'Test Book',
        authorName: 'Test Author',
        genre: 'Fiction',
        price: 19.99,
        published: '2023-06-15',
        isbn: '9780743273565'
      });

      component.onSubmit();

      const addedBook = mockBookStore.addBook.mock.calls[0][0];
      expect(addedBook.published).toBe('2023-06-15');
    });
  });
});
