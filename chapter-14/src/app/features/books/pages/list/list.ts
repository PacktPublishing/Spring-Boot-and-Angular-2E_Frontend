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
      authorName: 'Robert C. Martin',
      genre: 'Software Engineering',
      price: 29.99,
      published: '2008',
      isbn: '978-0132350884'
    },
    {
      title: 'The Great Gatsby',
      authorName: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      price: 15.99,
      published: '1925',
      isbn: '978-0743273565'
    },
    {
      title: 'The Girl with the Dragon Tattoo',
      authorName: 'Stieg Larsson',
      genre: 'Mystery',
      price: 18.50,
      published: '2005',
      isbn: '978-0307454546'
    },
    {
      title: 'Dune',
      authorName: 'Frank Herbert',
      genre: 'Science Fiction',
      price: 22.95,
      published: '1965',
      isbn: '978-0441172719'
    },
  ];

  headers: { headerName: string; fieldName: keyof Book }[] = [
    { headerName: 'Title', fieldName: 'title' },
    { headerName: 'Author', fieldName: 'authorName' },
    { headerName: 'Genre', fieldName: 'genre' },
    { headerName: 'Price', fieldName: 'price' },
    { headerName: 'Published', fieldName: 'published' },
    { headerName: 'ISBN', fieldName: 'isbn' },
  ];

  selectBook(book: Book): void {
    // handle selection logic
    console.log('Selected book:', book);
  }

  onBookCreated(bookData: Book): void {
    // Generate a simple ID for the new book
    const newBook: Book = {
      id: `book-${Date.now()}`,
      ...bookData
    };

    // Add the new book to the beginning of the list
    this.books = [newBook, ...this.books];

    console.log('New book added:', newBook);
  }
}
