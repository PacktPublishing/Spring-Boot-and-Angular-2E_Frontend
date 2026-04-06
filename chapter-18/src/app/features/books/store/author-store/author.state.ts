import { Author } from '../../../../shared/models/author';

export interface AuthorState {
  authors: Author[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

export const initialAuthorState: AuthorState = {
  authors: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  searchTerm: '',
  loading: false,
  error: null,
};
