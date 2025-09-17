export interface Book {
  id?: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  published: string;
  isbn?: string;
  description?: string;
  pageCount?: number;
  coverImageUrl?: string;
}

export interface BookCreateData {
  title: string;
  author: string;
  genre: string;
  price: number;
  published: string;
  isbn?: string;
  description?: string;
  pageCount?: number;
  coverImageUrl?: string;
}

