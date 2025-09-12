import { Component, OnInit } from '@angular/core';
import { Book } from '../../../../shared/models/book';
import { BookList } from "../../components/book-list/book-list";

@Component({
  selector: 'book-list-page',
  templateUrl: './list.html',
  imports: [BookList],
})
export class List {
  books: Book[] = [
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Software Engineering',
      price: 29.99,
      published: '2008-08-01'
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      price: 15.99,
      published: '1925-04-10'
    },
    {
      title: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      genre: 'Mystery',
      price: 18.50,
      published: '2005-08-01'
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      genre: 'Science Fiction',
      price: 22.95,
      published: '1965-08-01'
    },
  ];

  headers: { headerName: string; fieldName: keyof Book }[] = [
    { headerName: 'Title', fieldName: 'title' },
    { headerName: 'Author', fieldName: 'author' },
    { headerName: 'Genre', fieldName: 'genre' },
    { headerName: 'Price', fieldName: 'price' },
    { headerName: 'Published', fieldName: 'published' },
  ];

  selectBook(book: Book): void {
    // handle selection logic
  }
}
