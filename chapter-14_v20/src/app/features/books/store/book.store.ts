import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { on, withReducer, withEffects, Events, Dispatcher } from '@ngrx/signals/events';
import { computed, inject } from '@angular/core';
import { exhaustMap, switchMap, tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { BookState, initialBookState } from './book.state';
import { bookPageEvents, bookApiEvents } from './book.events';
import { BookService } from '../services/book.service';
import { Book } from '../../../shared/models/book';

export const BookStore = signalStore(
  { providedIn: 'root' },

  // Initialize state
  withState(initialBookState),

  // Reducers handle state changes
  withReducer(
    // Loading states
    on(bookApiEvents.loadRequested, () => ({
      loading: true,
      error: null,
    })),

    on(bookApiEvents.loadSuccess, (event) => ({
      books: event.payload.books,
      loading: false,
      error: null,
    })),

    on(bookApiEvents.loadFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    // CRUD operations
    on(bookApiEvents.addSuccess, (event) => (state) => ({
      ...state,
      books: [...state.books, event.payload.book],
    })),

    on(bookApiEvents.updateSuccess, (event) => (state) => ({
      ...state,
      books: state.books.map((book: Book) =>
        book.id === event.payload.book.id ? event.payload.book : book
      ),
    })),

    on(bookApiEvents.deleteSuccess, (event) => (state) => ({
      ...state,
      books: state.books.filter((book: Book) => book.id !== event.payload.id),
      selectedBookId: state.selectedBookId === event.payload.id ? null : state.selectedBookId,
    })),

    // UI interactions
    on(bookPageEvents.bookSelected, (event) => ({
      selectedBookId: event.payload.id,
    })),

    on(bookPageEvents.searchTermChanged, (event) => ({
      searchTerm: event.payload.term,
    })),

    on(bookPageEvents.genreFilterChanged, (event) => ({
      genreFilter: event.payload.genre,
    })),

    on(bookPageEvents.sortOrderChanged, (event) => ({
      sortOrder: event.payload.order,
    })),
  ),

  // Computed signals for derived state
  withComputed((store) => ({
    // Filter books by search term and genre
    filteredBooks: computed(() => {
      let books = store.books();

      // Apply search filter
      const searchTerm = store.searchTerm().toLowerCase();
      if (searchTerm) {
        books = books.filter((book: Book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.authorName.toLowerCase().includes(searchTerm)
        );
      }

      // Apply genre filter
      const genre = store.genreFilter();
      if (genre) {
        books = books.filter((book: Book) => book.genre === genre);
      }

      return books;
    }),

    // Get the currently selected book
    selectedBook: computed(() => {
      const id = store.selectedBookId();
      return id ? store.books().find((book: Book) => book.id === id) ?? null : null;
    }),

    // Check if we have any books
    hasBooks: computed(() => store.books().length > 0),

    // Check if filters are active
    hasActiveFilters: computed(() => {
      return store.searchTerm() !== '' || store.genreFilter() !== null;
    }),

    // Get unique genres for filter dropdown
    availableGenres: computed(() => {
      const genres = new Set(store.books().map((book: Book) => book.genre));
      return Array.from(genres).sort();
    }),
  })),

  // Additional computed for sorted books (depends on filteredBooks)
  withComputed((store) => ({
    sortedBooks: computed(() => {
      const books = [...store.filteredBooks()];
      const order = store.sortOrder();

      return books.sort((a: Book, b: Book) => {
        const comparison = a.title.localeCompare(b.title);
        return order === 'asc' ? comparison : -comparison;
      });
    }),
  })),

  // Effects handle async operations
  withEffects(
    (
      store,
      events = inject(Events),
      bookService = inject(BookService)
    ) => ({
      // Load books when page opens
      loadBooks$: events
        .on(bookPageEvents.opened, bookApiEvents.loadRequested)
        .pipe(
          exhaustMap(() =>
            bookService.getAll().pipe(
              map((books: Book[]) => bookApiEvents.loadSuccess({ books })),
              catchError((error: { message: string }) =>
                of(bookApiEvents.loadFailure({ error: error.message }))
              )
            )
          )
        ),

      // Handle delete requests
      deleteBook$: events
        .on(bookPageEvents.deleteRequested)
        .pipe(
          switchMap((event) =>
            bookService.delete(event.payload.id).pipe(
              map(() => bookApiEvents.deleteSuccess({ id: event.payload.id })),
              catchError((error: { message: string }) => {
                console.error('Failed to delete book:', error.message);
                return of(null);
              })
            )
          )
        ),

      // Log errors
      logErrors$: events
        .on(bookApiEvents.loadFailure)
        .pipe(tap((event) => console.error('Error:', event.payload.error))),
    })
  ),

  // Methods for components to call
  withMethods((store, bookService = inject(BookService), dispatcher = inject(Dispatcher)) => ({
    // Add a new book
    addBook(bookData: Omit<Book, 'id'>): void {
      bookService.create(bookData).pipe(
        tap((book: Book) => dispatcher.dispatch(bookApiEvents.addSuccess({ book }))),
        catchError((error) => {
          console.error('Failed to add book:', error);
          return of(null);
        })
      ).subscribe();
    },

    // Update existing book
    updateBook(book: Book): void {
      if (!book.id) {
        console.error('Book ID is required for update');
        return;
      }
      bookService.update(book.id, book).pipe(
        tap((updatedBook: Book) => dispatcher.dispatch(bookApiEvents.updateSuccess({ book: updatedBook }))),
        catchError((error) => {
          console.error('Failed to update book:', error);
          return of(null);
        })
      ).subscribe();
    },
  })),
);
