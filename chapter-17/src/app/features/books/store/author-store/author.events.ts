import { eventGroup } from '@ngrx/signals/events';
import { Author } from '../../../../shared/models/author';
import { type } from '@ngrx/signals';

export const authorPageEvents = eventGroup({
  source: 'Author Page',
  events: {
    loadAuthors: type<{
      page: number;
      size: number;
    }>(),
    searchByName: type<{ name: string }>(),
    createSubmitted: type<Omit<Author, 'id'>>(),
    updateSubmitted: type<{ id: number } & Omit<Author, 'id'>>(),
    deleteConfirmed: type<{ id: number }>(),
  },
});

export const authorApiEvents = eventGroup({
  source: 'Author API',
  events: {
    loadSuccess: type<{
      authors: Author[];
      totalElements: number;
      totalPages: number;
    }>(),
    loadFailure: type<{ error: string }>(),
    searchSuccess: type<{ authors: Author[] }>(),
    searchFailure: type<{ error: string }>(),
    createSuccess: type<{ author: Author }>(),
    createFailure: type<{ error: string }>(),
    updateSuccess: type<{ author: Author }>(),
    updateFailure: type<{ error: string }>(),
    deleteSuccess: type<{ id: number }>(),
    deleteFailure: type<{ error: string }>(),
  },
});
