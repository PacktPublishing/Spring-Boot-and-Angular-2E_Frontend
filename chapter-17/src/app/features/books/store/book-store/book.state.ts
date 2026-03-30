import { Book } from '../../../../shared/models/book';

export interface BookState {
  books: Book[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  genreFilter: string;
  loading: boolean;
  error: string | null;
}

export const initialBookState: BookState = {
  books: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  searchTerm: '',
  genreFilter: '',
  loading: false,
  error: null,
};
