import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed } from '@ngrx/signals';
import { withReducer, withEventHandlers, Events, on } from '@ngrx/signals/events';
import { switchMap, map, catchError, of, exhaustMap } from 'rxjs';
import { normalizeApiErrorMessage } from '../../../../shared/utils/error-message';
import { BookService } from '../../services/book.service';
import { bookPageEvents, bookApiEvents } from './book.events';
import { initialBookState } from './book.state';

export const BookStore = signalStore(
  { providedIn: 'root' },

  withState(initialBookState),
  withReducer(
    // Loading
    on(bookPageEvents.loadBooks, (event) => ({
      loading: true,
      error: null,
      currentPage: event.payload.page,
      pageSize: event.payload.size,
    })),
    on(bookApiEvents.loadSuccess, (event) => ({
      books: event.payload.books,
      totalElements: event.payload.totalElements,
      totalPages: event.payload.totalPages,
      loading: false,
      error: null,
    })),
    on(bookApiEvents.loadFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    // Search
    on(bookPageEvents.searchByTitle, (event) => ({
      loading: true,
      error: null,
      searchTerm: event.payload.title,
    })),
    on(bookApiEvents.searchSuccess, (event) => ({
      books: event.payload.books,
      loading: false,
      error: null,
    })),
    on(bookApiEvents.searchFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    // Create / Update / Delete
    on(bookPageEvents.createSubmitted, () => ({
      loading: true,
      error: null,
    })),
    on(bookApiEvents.createSuccess, () => ({
      loading: false,
      error: null,
    })),
    on(bookApiEvents.createFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),
    on(bookPageEvents.updateSubmitted, () => ({
      loading: true,
      error: null,
    })),
    on(bookApiEvents.updateSuccess, () => ({
      loading: false,
      error: null,
    })),
    on(bookApiEvents.updateFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),
    on(bookPageEvents.deleteConfirmed, () => ({
      loading: true,
      error: null,
    })),
    on(bookApiEvents.deleteSuccess, () => ({
      loading: false,
      error: null,
    })),
    on(bookApiEvents.deleteFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),
  ),
  withComputed((store) => ({
    hasBooks: computed(() => store.books().length > 0),
    isSearching: computed(() => store.searchTerm().length > 0),
    bookCount: computed(() => store.totalElements()),
  })),
  withEventHandlers((store, events = inject(Events), bookService = inject(BookService)) => ({
    load$: events.on(bookPageEvents.loadBooks).pipe(
      switchMap((event) =>
        bookService.getPaged(event.payload.page, event.payload.size).pipe(
          map((response) =>
            bookApiEvents.loadSuccess({
              books: response.content,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
            }),
          ),
          catchError((error: unknown) =>
            of(
              bookApiEvents.loadFailure({
                error: normalizeApiErrorMessage(error, 'Failed to load books'),
              }),
            ),
          ),
        ),
      ),
    ),

    search$: events.on(bookPageEvents.searchByTitle).pipe(
      switchMap((event) => {
        if (event.payload.title.trim() === '') {
          return of(
            bookApiEvents.searchSuccess({
              books: [],
            }),
          );
        }
        return bookService.searchByTitle(event.payload.title).pipe(
          map((books) =>
            bookApiEvents.searchSuccess({
              books,
            }),
          ),
          catchError((error: unknown) =>
            of(
              bookApiEvents.searchFailure({
                error: normalizeApiErrorMessage(error, 'Search failed'),
              }),
            ),
          ),
        );
      }),
    ),

    create$: events.on(bookPageEvents.createSubmitted).pipe(
      exhaustMap((event) =>
        bookService.create(event.payload).pipe(
          map((book) =>
            bookApiEvents.createSuccess({
              book,
            }),
          ),
          catchError((error: unknown) =>
            of(
              bookApiEvents.createFailure({
                error: normalizeApiErrorMessage(error, 'Failed to create book'),
              }),
            ),
          ),
        ),
      ),
    ),

    update$: events.on(bookPageEvents.updateSubmitted).pipe(
      exhaustMap((event) => {
        const { id, ...data } = event.payload;
        return bookService.update(id, data).pipe(
          map((book) =>
            bookApiEvents.updateSuccess({
              book,
            }),
          ),
          catchError((error: unknown) =>
            of(
              bookApiEvents.updateFailure({
                error: normalizeApiErrorMessage(error, 'Failed to update book'),
              }),
            ),
          ),
        );
      }),
    ),

    delete$: events.on(bookPageEvents.deleteConfirmed).pipe(
      exhaustMap((event) =>
        bookService.delete(event.payload.id).pipe(
          map(() =>
            bookApiEvents.deleteSuccess({
              id: event.payload.id,
            }),
          ),
          catchError((error: unknown) =>
            of(
              bookApiEvents.deleteFailure({
                error: normalizeApiErrorMessage(error, 'Failed to delete book'),
              }),
            ),
          ),
        ),
      ),
    ),

    reloadAfterCreate$: events.on(bookApiEvents.createSuccess).pipe(
      map(() =>
        bookPageEvents.loadBooks({
          page: store.currentPage(),
          size: store.pageSize(),
        }),
      ),
    ),

    reloadAfterUpdate$: events.on(bookApiEvents.updateSuccess).pipe(
      map(() =>
        bookPageEvents.loadBooks({
          page: store.currentPage(),
          size: store.pageSize(),
        }),
      ),
    ),

    reloadAfterDelete$: events.on(bookApiEvents.deleteSuccess).pipe(
      map(() =>
        bookPageEvents.loadBooks({
          page: store.currentPage(),
          size: store.pageSize(),
        }),
      ),
    ),
  })),
);
