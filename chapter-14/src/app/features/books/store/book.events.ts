import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Book } from '../../../shared/models/book';

export const bookPageEvents = eventGroup({
  source: 'Books Page',
  events: {
    opened: type<void>(),
    bookSelected: type<{ id: string | null }>(),
    searchTermChanged: type<{ term: string }>(),
    genreFilterChanged: type<{ genre: string | null }>(),
    sortOrderChanged: type<{ order: 'asc' | 'desc' }>(),
    deleteRequested: type<{ id: string }>(),
  },
});

export const bookApiEvents = eventGroup({
  source: 'Books API',
  events: {
    loadRequested: type<void>(),
    loadSuccess: type<{ books: Book[] }>(),
    loadFailure: type<{ error: string }>(),
    addSuccess: type<{ book: Book }>(),
    updateSuccess: type<{ book: Book }>(),
    deleteSuccess: type<{ id: string }>(),
  },
});
