import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { of, throwError } from 'rxjs';
import { BookService } from '../../services/book.service';
import { bookPageEvents } from './book.events';
import { BookStore } from './book.store';

describe('BookStore', () => {
  let store: InstanceType<typeof BookStore>;
  let dispatcher: Dispatcher;
  let bookService: {
    getPaged: ReturnType<typeof vi.fn>;
    searchByTitleIgnoreCase: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockBooks = [
    {
      id: 1,
      title: 'Clean Code',
      author: { id: 1, name: 'Robert C. Martin', nationality: '' },
      genre: 'Software Engineering',
      isbn: '9780132350884',
      published: '2008-08-01',
      price: 29.99,
    },
    {
      id: 2,
      title: 'Domain-Driven Design',
      author: { id: 2, name: 'Eric Evans', nationality: '' },
      genre: 'Software Engineering',
      isbn: '9780321125217',
      published: '2003-08-30',
      price: 39.99,
    },
  ];

  const mockPagedResponse = {
    content: mockBooks,
    totalElements: 2,
    totalPages: 1,
    size: 10,
    number: 0,
    first: true,
    last: true,
    empty: false,
  };

  beforeEach(() => {
    bookService = {
      getPaged: vi.fn(),
      searchByTitleIgnoreCase: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        BookStore,
        provideRouter([]),
        provideLocationMocks(),
        { provide: BookService, useValue: bookService },
      ],
    });

    store = TestBed.inject(BookStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  describe('Initial State', () => {
    it('should start with empty books', () => {
      expect(store.books()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.hasBooks()).toBe(false);
    });
  });

  describe('Load Books', () => {
    it('should load on event', async () => {
      bookService.getPaged.mockReturnValue(of(mockPagedResponse));

      dispatcher.dispatch(
        bookPageEvents.loadBooks({
          page: 0,
          size: 10,
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(bookService.getPaged).toHaveBeenCalledWith(0, 10);
      expect(store.books()).toEqual(mockBooks);
      expect(store.totalElements()).toBe(2);
      expect(store.loading()).toBe(false);
    });

    it('should handle failure', async () => {
      bookService.getPaged.mockReturnValue(throwError(() => new Error('Network error')));

      dispatcher.dispatch(
        bookPageEvents.loadBooks({
          page: 0,
          size: 10,
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(store.error()).toContain('Network error');
      expect(store.loading()).toBe(false);
    });
  });

  describe('Search Books', () => {
    it('should search and derive totals from the flat response for a non-blank term', async () => {
      bookService.searchByTitleIgnoreCase.mockReturnValue(of([mockBooks[0]]));

      dispatcher.dispatch(
        bookPageEvents.searchByTitle({
          title: 'Clean',
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(bookService.searchByTitleIgnoreCase).toHaveBeenCalledWith('Clean');
      expect(store.books()).toEqual([mockBooks[0]]);
      expect(store.totalElements()).toBe(1);
      expect(store.totalPages()).toBe(1);
      expect(store.currentPage()).toBe(0);
      expect(store.loading()).toBe(false);
    });

    it('should short-circuit to an empty result without calling the service for a blank term', async () => {
      dispatcher.dispatch(
        bookPageEvents.searchByTitle({
          title: '   ',
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(bookService.searchByTitleIgnoreCase).not.toHaveBeenCalled();
      expect(store.books()).toEqual([]);
      expect(store.totalElements()).toBe(0);
    });

    it('should handle search failure', async () => {
      bookService.searchByTitleIgnoreCase.mockReturnValue(
        throwError(() => new Error('Search error')),
      );

      dispatcher.dispatch(
        bookPageEvents.searchByTitle({
          title: 'Clean',
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(store.error()).toContain('Search error');
      expect(store.loading()).toBe(false);
    });

    it('should report zero total pages for a search that returns no books', async () => {
      bookService.searchByTitleIgnoreCase.mockReturnValue(of([]));

      dispatcher.dispatch(
        bookPageEvents.searchByTitle({
          title: 'Nonexistent',
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(store.books()).toEqual([]);
      expect(store.totalElements()).toBe(0);
      expect(store.totalPages()).toBe(0);
    });

    it('should reset searchTerm and isSearching when loadBooks is dispatched after a search', async () => {
      bookService.searchByTitleIgnoreCase.mockReturnValue(of([mockBooks[0]]));

      dispatcher.dispatch(
        bookPageEvents.searchByTitle({
          title: 'Clean',
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(store.searchTerm()).toBe('Clean');
      expect(store.isSearching()).toBe(true);

      bookService.getPaged.mockReturnValue(of(mockPagedResponse));

      dispatcher.dispatch(
        bookPageEvents.loadBooks({
          page: 0,
          size: 10,
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(store.searchTerm()).toBe('');
      expect(store.isSearching()).toBe(false);
    });
  });

  describe('Create Book', () => {
    it('should create and reload', async () => {
      const newBook = {
        title: 'Effective TypeScript',
        isbn: '9781492053743',
        published: '2019-10-15',
        price: 34.99,
        genre: 'Programming',
        authorId: 1,
      };
      bookService.create.mockReturnValue(
        of({ id: 5, ...newBook, author: { id: 1, name: 'Dan Vanderkam', nationality: '' } }),
      );
      bookService.getPaged.mockReturnValue(of(mockPagedResponse));

      dispatcher.dispatch(bookPageEvents.createSubmitted(newBook));

      await new Promise((r) => setTimeout(r, 200));

      expect(bookService.create).toHaveBeenCalledWith(newBook);
      expect(bookService.getPaged).toHaveBeenCalled();
    });
  });

  describe('Delete Book', () => {
    it('should delete and reload', async () => {
      bookService.delete.mockReturnValue(of(undefined));
      bookService.getPaged.mockReturnValue(of(mockPagedResponse));

      dispatcher.dispatch(
        bookPageEvents.deleteConfirmed({
          id: 1,
        }),
      );

      await new Promise((r) => setTimeout(r, 200));

      expect(bookService.delete).toHaveBeenCalledWith(1);
      expect(bookService.getPaged).toHaveBeenCalled();
    });
  });
});
