import { TestBed } from '@angular/core/testing';
import { BookStore } from './book.store';
import { bookPageEvents, bookApiEvents } from './book.events';
import { BookService } from '../services/book.service';
import { Dispatcher } from '@ngrx/signals/events';
import { of, throwError, delay } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('BookStore', () => {
  let store: InstanceType<typeof BookStore>;
  let bookService: any;
  let dispatcher: Dispatcher;

  const mockBooks = [
    { id: '1', title: 'Clean Code', authorName: 'Robert Martin', genre: 'Programming', price: 29.99, published: '2008', isbn: '978-0132350884' },
    { id: '2', title: 'Design Patterns', authorName: 'Gang of Four', genre: 'Programming', price: 39.99, published: '1994', isbn: '978-0201633610' },
    { id: '3', title: 'The Hobbit', authorName: 'J.R.R. Tolkien', genre: 'Fantasy', price: 19.99, published: '1937', isbn: '978-0547928227' },
  ];

  beforeEach(() => {
    const bookServiceMock = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        BookStore,
        { provide: BookService, useValue: bookServiceMock },
      ],
    });

    store = TestBed.inject(BookStore);
    bookService = TestBed.inject(BookService);
    dispatcher = TestBed.inject(Dispatcher);
  });

  describe('Initial State', () => {
    it('should initialize with empty books array', () => {
      expect(store.books()).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(store.loading()).toBe(false);
    });

    it('should initialize with null error', () => {
      expect(store.error()).toBeNull();
    });

    it('should initialize with empty search term', () => {
      expect(store.searchTerm()).toBe('');
    });

    it('should initialize with null genre filter', () => {
      expect(store.genreFilter()).toBeNull();
    });

    it('should initialize with ascending sort order', () => {
      expect(store.sortOrder()).toBe('asc');
    });
  });

  describe('Loading Events', () => {
    it('should set loading to true when loadRequested (then load)', async () => {
      // Use a delayed observable to test loading state
      bookService.getAll.mockReturnValue(of(mockBooks).pipe(delay(50)));

      dispatcher.dispatch(bookApiEvents.loadRequested());

      // Loading should be true while request is in flight
      expect(store.loading()).toBe(true);
      expect(store.error()).toBeNull();

      // Wait for the effect to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should have loaded books and set loading to false
      expect(store.loading()).toBe(false);
      expect(store.books()).toEqual(mockBooks);
    });

    it('should update books when loadSuccess', () => {
      dispatcher.dispatch(bookApiEvents.loadSuccess({ books: mockBooks }));

      expect(store.books()).toEqual(mockBooks);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should set error when loadFailure', () => {
      const errorMessage = 'Failed to load books';
      dispatcher.dispatch(bookApiEvents.loadFailure({ error: errorMessage }));

      expect(store.error()).toBe(errorMessage);
      expect(store.loading()).toBe(false);
    });

    it('should load books from service when page opened', async () => {
      bookService.getAll.mockReturnValue(of(mockBooks));

      dispatcher.dispatch(bookPageEvents.opened());

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(store.books()).toEqual(mockBooks);
      expect(store.loading()).toBe(false);
    });

    it('should handle service errors', async () => {
      const error = new Error('Network error');
      bookService.getAll.mockReturnValue(throwError(() => error));

      dispatcher.dispatch(bookPageEvents.opened());

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(store.error()).toBe('Network error');
      expect(store.loading()).toBe(false);
    });
  });

  describe('CRUD Events', () => {
    beforeEach(() => {
      dispatcher.dispatch(bookApiEvents.loadSuccess({ books: mockBooks }));
    });

    it('should add book when addSuccess', () => {
      const newBook = { id: '4', title: 'Refactoring', authorName: 'Martin Fowler', genre: 'Programming', price: 34.99, published: '1999', isbn: '978-0201485677' };

      dispatcher.dispatch(bookApiEvents.addSuccess({ book: newBook }));

      expect(store.books().length).toBe(4);
      expect(store.books()).toContainEqual(newBook);
    });

    it('should update book when updateSuccess', () => {
      const updatedBook = { ...mockBooks[0], title: 'Clean Code - Updated' };

      dispatcher.dispatch(bookApiEvents.updateSuccess({ book: updatedBook }));

      const book = store.books().find(b => b.id === '1');
      expect(book?.title).toBe('Clean Code - Updated');
    });

    it('should not modify other books when updating one', () => {
      const updatedBook = { ...mockBooks[0], title: 'Clean Code - Updated' };

      dispatcher.dispatch(bookApiEvents.updateSuccess({ book: updatedBook }));

      expect(store.books()[1]).toEqual(mockBooks[1]);
      expect(store.books()[2]).toEqual(mockBooks[2]);
    });

    it('should delete book when deleteSuccess', () => {
      dispatcher.dispatch(bookApiEvents.deleteSuccess({ id: '1' }));

      expect(store.books().length).toBe(2);
      expect(store.books().find(b => b.id === '1')).toBeUndefined();
    });

    it('should clear selected book when deleted book is selected', () => {
      dispatcher.dispatch(bookPageEvents.bookSelected({ id: '1' }));
      expect(store.selectedBookId()).toBe('1');

      dispatcher.dispatch(bookApiEvents.deleteSuccess({ id: '1' }));
      expect(store.selectedBookId()).toBeNull();
    });

    it('should not clear selected book when different book is deleted', () => {
      dispatcher.dispatch(bookPageEvents.bookSelected({ id: '1' }));

      dispatcher.dispatch(bookApiEvents.deleteSuccess({ id: '2' }));
      expect(store.selectedBookId()).toBe('1');
    });
  });

  describe('Selection Events', () => {
    beforeEach(() => {
      dispatcher.dispatch(bookApiEvents.loadSuccess({ books: mockBooks }));
    });

    it('should set selected book id', () => {
      dispatcher.dispatch(bookPageEvents.bookSelected({ id: '1' }));

      expect(store.selectedBookId()).toBe('1');
    });

    it('should clear selection when null is passed', () => {
      dispatcher.dispatch(bookPageEvents.bookSelected({ id: '1' }));
      dispatcher.dispatch(bookPageEvents.bookSelected({ id: null }));

      expect(store.selectedBookId()).toBeNull();
    });
  });

  describe('Filter Events', () => {
    beforeEach(() => {
      dispatcher.dispatch(bookApiEvents.loadSuccess({ books: mockBooks }));
    });

    it('should update search term', () => {
      dispatcher.dispatch(bookPageEvents.searchTermChanged({ term: 'clean' }));

      expect(store.searchTerm()).toBe('clean');
    });

    it('should update genre filter', () => {
      dispatcher.dispatch(bookPageEvents.genreFilterChanged({ genre: 'Programming' }));

      expect(store.genreFilter()).toBe('Programming');
    });

    it('should update sort order', () => {
      dispatcher.dispatch(bookPageEvents.sortOrderChanged({ order: 'desc' }));

      expect(store.sortOrder()).toBe('desc');
    });
  });

  describe('Computed Signals', () => {
    beforeEach(() => {
      dispatcher.dispatch(bookApiEvents.loadSuccess({ books: mockBooks }));
    });

    describe('filteredBooks', () => {
      it('should return all books when no filters applied', () => {
        expect(store.filteredBooks().length).toBe(3);
      });

      it('should filter books by search term in title', () => {
        dispatcher.dispatch(bookPageEvents.searchTermChanged({ term: 'clean' }));

        expect(store.filteredBooks().length).toBe(1);
        expect(store.filteredBooks()[0].title).toBe('Clean Code');
      });

      it('should filter books by search term in author', () => {
        dispatcher.dispatch(bookPageEvents.searchTermChanged({ term: 'tolkien' }));

        expect(store.filteredBooks().length).toBe(1);
        expect(store.filteredBooks()[0].authorName).toBe('J.R.R. Tolkien');
      });

      it('should filter books by genre', () => {
        dispatcher.dispatch(bookPageEvents.genreFilterChanged({ genre: 'Programming' }));

        expect(store.filteredBooks().length).toBe(2);
        expect(store.filteredBooks().every(b => b.genre === 'Programming')).toBe(true);
      });

      it('should apply both search and genre filters', () => {
        dispatcher.dispatch(bookPageEvents.searchTermChanged({ term: 'design' }));
        dispatcher.dispatch(bookPageEvents.genreFilterChanged({ genre: 'Programming' }));

        expect(store.filteredBooks().length).toBe(1);
        expect(store.filteredBooks()[0].title).toBe('Design Patterns');
      });

      it('should be case insensitive', () => {
        dispatcher.dispatch(bookPageEvents.searchTermChanged({ term: 'CLEAN' }));

        expect(store.filteredBooks().length).toBe(1);
      });
    });

    describe('sortedBooks', () => {
      it('should sort books in ascending order by default', () => {
        const titles = store.sortedBooks().map(b => b.title);
        expect(titles).toEqual(['Clean Code', 'Design Patterns', 'The Hobbit']);
      });

      it('should sort books in descending order', () => {
        dispatcher.dispatch(bookPageEvents.sortOrderChanged({ order: 'desc' }));

        const titles = store.sortedBooks().map(b => b.title);
        expect(titles).toEqual(['The Hobbit', 'Design Patterns', 'Clean Code']);
      });

      it('should sort filtered books', () => {
        dispatcher.dispatch(bookPageEvents.genreFilterChanged({ genre: 'Programming' }));

        const titles = store.sortedBooks().map(b => b.title);
        expect(titles).toEqual(['Clean Code', 'Design Patterns']);
      });
    });

    describe('selectedBook', () => {
      it('should return null when no book selected', () => {
        expect(store.selectedBook()).toBeNull();
      });

      it('should return selected book', () => {
        dispatcher.dispatch(bookPageEvents.bookSelected({ id: '1' }));

        expect(store.selectedBook()).toEqual(mockBooks[0]);
      });

      it('should return null when selected book id does not exist', () => {
        dispatcher.dispatch(bookPageEvents.bookSelected({ id: '999' }));

        expect(store.selectedBook()).toBeNull();
      });
    });

    describe('hasBooks', () => {
      it('should return true when books exist', () => {
        expect(store.hasBooks()).toBe(true);
      });

      it('should return false when no books', () => {
        dispatcher.dispatch(bookApiEvents.loadSuccess({ books: [] }));

        expect(store.hasBooks()).toBe(false);
      });
    });

    describe('hasActiveFilters', () => {
      it('should return false when no filters active', () => {
        expect(store.hasActiveFilters()).toBe(false);
      });

      it('should return true when search term is set', () => {
        dispatcher.dispatch(bookPageEvents.searchTermChanged({ term: 'test' }));

        expect(store.hasActiveFilters()).toBe(true);
      });

      it('should return true when genre filter is set', () => {
        dispatcher.dispatch(bookPageEvents.genreFilterChanged({ genre: 'Programming' }));

        expect(store.hasActiveFilters()).toBe(true);
      });
    });

    describe('availableGenres', () => {
      it('should return unique sorted genres', () => {
        const genres = store.availableGenres();

        expect(genres).toEqual(['Fantasy', 'Programming']);
      });

      it('should update when books change', () => {
        const newBooks = [...mockBooks, { id: '4', title: 'Test', authorName: 'Test', genre: 'Science', price: 10, published: '2020', isbn: '978-0000000000' }];
        dispatcher.dispatch(bookApiEvents.loadSuccess({ books: newBooks }));

        const genres = store.availableGenres();
        expect(genres).toEqual(['Fantasy', 'Programming', 'Science']);
      });
    });
  });
});
