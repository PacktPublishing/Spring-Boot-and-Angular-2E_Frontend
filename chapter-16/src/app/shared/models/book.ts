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
