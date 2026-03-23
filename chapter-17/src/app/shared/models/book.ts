export interface Book {
  id?: number;
  title: string;
  authorName: string;
  genre: string;
  price: number;
  published: string;
  isbn: string;
  description?: string;
  pageCount?: number;
  coverImageUrl?: string;
}

export interface BookRequest {
  title: string;
  isbn: string;
  authorId: number;
  price: number;
  genre: string;
  published: string;
  description?: string;
  pageCount?: number;
  coverImageUrl?: string;
}
