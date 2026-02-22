import { Component, signal } from '@angular/core';
import { BookList } from '../../components/book-list/book-list';
import { Book } from '../../../../shared/models/book';

@Component({
  selector: 'book-list-page',
  imports: [BookList],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  books: Book[] = [
    {
      title: 'Clean Code',
      authorName: 'Robert C. Martin',
      genre: 'Software Engineering',
      price: 29.99,
      published: '2008-08-01',
      isbn: '978-0132350884',
    },
  ];

  headers: { headerName: string; fieldName: keyof Book }[] = [
    { headerName: 'Title', fieldName: 'title' },
    { headerName: 'Author', fieldName: 'authorName' },
    { headerName: 'Genre', fieldName: 'genre' },
    { headerName: 'Price', fieldName: 'price' },
    { headerName: 'Published', fieldName: 'published' },
  ];

  selectBook(book: Book): void {
    // handle selection logic
  }
}
