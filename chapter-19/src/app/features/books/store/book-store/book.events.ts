import { eventGroup } from '@ngrx/signals/events';
import { Book, BookRequest } from '../../../../shared/models/book';
import { type } from '@ngrx/signals';

export const bookPageEvents = eventGroup({
  source: 'Book Page',
  events: {
    loadBooks: type<{
      page: number;
      size: number;
    }>(),
    searchByTitle: type<{ title: string }>(),
    createSubmitted: type<BookRequest>(),
    updateSubmitted: type<{ id: number } & BookRequest>(),
    deleteConfirmed: type<{ id: number }>(),
  },
});

export const bookApiEvents = eventGroup({
  source: 'Book API',
  events: {
    loadSuccess: type<{
      books: Book[];
      totalElements: number;
      totalPages: number;
    }>(),
    loadFailure: type<{ error: string }>(),
    searchSuccess: type<{ books: Book[] }>(),
    searchFailure: type<{ error: string }>(),
    createSuccess: type<{ book: Book }>(),
    createFailure: type<{ error: string }>(),
    updateSuccess: type<{ book: Book }>(),
    updateFailure: type<{ error: string }>(),
    deleteSuccess: type<{ id: number }>(),
    deleteFailure: type<{ error: string }>(),
  },
});
