import { Book } from '../../../shared/models/book';

export interface BookState {
  // Data
  books: Book[];
  selectedBookId: string | null;

  // UI state
  loading: boolean;
  error: string | null;

  // Filters
  searchTerm: string;
  genreFilter: string | null;
  sortOrder: 'asc' | 'desc';
}

export const initialBookState: BookState = {
  books: [],
  selectedBookId: null,
  loading: false,
  error: null,
  searchTerm: '',
  genreFilter: null,
  sortOrder: 'asc',
};
