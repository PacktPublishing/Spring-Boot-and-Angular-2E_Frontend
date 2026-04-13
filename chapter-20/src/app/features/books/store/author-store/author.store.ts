import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed } from '@ngrx/signals';
import { withReducer, withEventHandlers, Events, on } from '@ngrx/signals/events';
import { switchMap, map, catchError, of, exhaustMap } from 'rxjs';
import { normalizeApiErrorMessage } from '../../../../shared/utils/error-message';
import { AuthorService } from '../../services/author.service';
import { authorPageEvents, authorApiEvents } from './author.events';
import { initialAuthorState } from './author.state';

export const AuthorStore = signalStore(
  { providedIn: 'root' },

  withState(initialAuthorState),
  withReducer(
    // Loading
    on(authorPageEvents.loadAuthors, (event) => ({
      loading: true,
      error: null,
      currentPage: event.payload.page,
      pageSize: event.payload.size,
    })),
    on(authorApiEvents.loadSuccess, (event) => ({
      authors: event.payload.authors,
      totalElements: event.payload.totalElements,
      totalPages: event.payload.totalPages,
      loading: false,
      error: null,
    })),
    on(authorApiEvents.loadFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    // Search
    on(authorPageEvents.searchByName, (event) => ({
      loading: true,
      error: null,
      searchTerm: event.payload.name,
    })),
    on(authorApiEvents.searchSuccess, (event) => ({
      authors: event.payload.authors,
      loading: false,
      error: null,
    })),
    on(authorApiEvents.searchFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),

    // Create / Update / Delete
    on(authorPageEvents.createSubmitted, () => ({
      loading: true,
      error: null,
    })),
    on(authorApiEvents.createSuccess, () => ({
      loading: false,
      error: null,
    })),
    on(authorApiEvents.createFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),
    on(authorPageEvents.updateSubmitted, () => ({
      loading: true,
      error: null,
    })),
    on(authorApiEvents.updateSuccess, () => ({
      loading: false,
      error: null,
    })),
    on(authorApiEvents.updateFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),
    on(authorPageEvents.deleteConfirmed, () => ({
      loading: true,
      error: null,
    })),
    on(authorApiEvents.deleteSuccess, () => ({
      loading: false,
      error: null,
    })),
    on(authorApiEvents.deleteFailure, (event) => ({
      loading: false,
      error: event.payload.error,
    })),
  ),
  withComputed((store) => ({
    hasAuthors: computed(() => store.authors().length > 0),
    isSearching: computed(() => store.searchTerm().length > 0),
    authorCount: computed(() => store.totalElements()),
  })),
  withEventHandlers((store, events = inject(Events), authorService = inject(AuthorService)) => ({
    load$: events.on(authorPageEvents.loadAuthors).pipe(
      switchMap((event) =>
        authorService.getPaged(event.payload.page, event.payload.size).pipe(
          map((response) =>
            authorApiEvents.loadSuccess({
              authors: response.content,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
            }),
          ),
          catchError((error: unknown) =>
            of(
              authorApiEvents.loadFailure({
                error: normalizeApiErrorMessage(error, 'Failed to load authors'),
              }),
            ),
          ),
        ),
      ),
    ),

    search$: events.on(authorPageEvents.searchByName).pipe(
      switchMap((event) => {
        if (event.payload.name.trim() === '') {
          return of(
            authorApiEvents.searchSuccess({
              authors: [],
            }),
          );
        }
        return authorService.searchByName(event.payload.name).pipe(
          map((authors) =>
            authorApiEvents.searchSuccess({
              authors,
            }),
          ),
          catchError((error: unknown) =>
            of(
              authorApiEvents.searchFailure({
                error: normalizeApiErrorMessage(error, 'Search failed'),
              }),
            ),
          ),
        );
      }),
    ),

    create$: events.on(authorPageEvents.createSubmitted).pipe(
      exhaustMap((event) =>
        authorService.create(event.payload).pipe(
          map((author) =>
            authorApiEvents.createSuccess({
              author,
            }),
          ),
          catchError((error: unknown) =>
            of(
              authorApiEvents.createFailure({
                error: normalizeApiErrorMessage(error, 'Failed to create author'),
              }),
            ),
          ),
        ),
      ),
    ),

    update$: events.on(authorPageEvents.updateSubmitted).pipe(
      exhaustMap((event) => {
        const { id, ...data } = event.payload;
        return authorService.update(id, data).pipe(
          map((author) =>
            authorApiEvents.updateSuccess({
              author,
            }),
          ),
          catchError((error: unknown) =>
            of(
              authorApiEvents.updateFailure({
                error: normalizeApiErrorMessage(error, 'Failed to update author'),
              }),
            ),
          ),
        );
      }),
    ),

    delete$: events.on(authorPageEvents.deleteConfirmed).pipe(
      exhaustMap((event) =>
        authorService.delete(event.payload.id).pipe(
          map(() =>
            authorApiEvents.deleteSuccess({
              id: event.payload.id,
            }),
          ),
          catchError((error: unknown) =>
            of(
              authorApiEvents.deleteFailure({
                error: normalizeApiErrorMessage(error, 'Failed to delete author'),
              }),
            ),
          ),
        ),
      ),
    ),

    reloadAfterCreate$: events.on(authorApiEvents.createSuccess).pipe(
      map(() =>
        authorPageEvents.loadAuthors({
          page: store.currentPage(),
          size: store.pageSize(),
        }),
      ),
    ),

    reloadAfterUpdate$: events.on(authorApiEvents.updateSuccess).pipe(
      map(() =>
        authorPageEvents.loadAuthors({
          page: store.currentPage(),
          size: store.pageSize(),
        }),
      ),
    ),

    reloadAfterDelete$: events.on(authorApiEvents.deleteSuccess).pipe(
      map(() =>
        authorPageEvents.loadAuthors({
          page: store.currentPage(),
          size: store.pageSize(),
        }),
      ),
    ),
  })),
);
