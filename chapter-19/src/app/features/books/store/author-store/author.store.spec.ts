import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { of, throwError } from 'rxjs';
import { AuthorService } from '../../services/author.service';
import { authorPageEvents } from './author.events';
import { AuthorStore } from './author.store';

describe('AuthorStore', () => {
  let store: InstanceType<typeof AuthorStore>;
  let dispatcher: Dispatcher;
  let authorService: {
    getPaged: ReturnType<typeof vi.fn>;
    searchByName: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const mockAuthors = [
    { id: 1, name: 'Ahmad Gohar', nationality: 'Egypt', books: [] },
    { id: 2, name: 'Dimitris Kiriakakis', nationality: 'Greece', books: [] },
  ];

  const mockPagedResponse = {
    content: mockAuthors,
    totalElements: 2,
    totalPages: 1,
    size: 10,
    number: 0,
    first: true,
    last: true,
    empty: false,
  };

  beforeEach(() => {
    authorService = {
      getPaged: vi.fn(),
      searchByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthorStore,
        provideRouter([]),
        provideLocationMocks(),
        { provide: AuthorService, useValue: authorService },
      ],
    });

    store = TestBed.inject(AuthorStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  describe('Initial State', () => {
    it('should start with empty authors', () => {
      expect(store.authors()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.hasAuthors()).toBe(false);
    });
  });

  describe('Load Authors', () => {
    it('should load on event', async () => {
      authorService.getPaged.mockReturnValue(of(mockPagedResponse));

      dispatcher.dispatch(
        authorPageEvents.loadAuthors({
          page: 0,
          size: 10,
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(authorService.getPaged).toHaveBeenCalledWith(0, 10);
      expect(store.authors()).toEqual(mockAuthors);
      expect(store.totalElements()).toBe(2);
      expect(store.loading()).toBe(false);
    });

    it('should handle failure', async () => {
      authorService.getPaged.mockReturnValue(throwError(() => new Error('Network error')));

      dispatcher.dispatch(
        authorPageEvents.loadAuthors({
          page: 0,
          size: 10,
        }),
      );

      await new Promise((r) => setTimeout(r, 100));

      expect(store.error()).toContain('Network error');
      expect(store.loading()).toBe(false);
    });
  });

  describe('Create Author', () => {
    it('should create and reload', async () => {
      const newAuthor = {
        name: 'Robert C. Martin',
        nationality: 'USA',
      };
      authorService.create.mockReturnValue(of({ id: 3, ...newAuthor, books: null }));
      authorService.getPaged.mockReturnValue(of(mockPagedResponse));

      dispatcher.dispatch(authorPageEvents.createSubmitted(newAuthor));

      await new Promise((r) => setTimeout(r, 200));

      expect(authorService.create).toHaveBeenCalledWith(newAuthor);
      expect(authorService.getPaged).toHaveBeenCalled();
    });
  });

  describe('Delete Author', () => {
    it('should delete and reload', async () => {
      authorService.delete.mockReturnValue(of(undefined));
      authorService.getPaged.mockReturnValue(of(mockPagedResponse));

      dispatcher.dispatch(
        authorPageEvents.deleteConfirmed({
          id: 1,
        }),
      );

      await new Promise((r) => setTimeout(r, 200));

      expect(authorService.delete).toHaveBeenCalledWith(1);
      expect(authorService.getPaged).toHaveBeenCalled();
    });
  });
});
