import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Book } from '../../../shared/models/book';

@Injectable({ providedIn: 'root' })
export class BookService {
  private mockBooks: Book[] = [
    {
      id: '1',
      title: 'Clean Code',
      authorName: 'Robert C. Martin',
      genre: 'Software Engineering',
      price: 29.99,
      published: '2008',
      isbn: '978-0132350884'
    },
    {
      id: '2',
      title: 'The Great Gatsby',
      authorName: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      price: 15.99,
      published: '1925',
      isbn: '978-0743273565'
    },
    {
      id: '3',
      title: 'The Girl with the Dragon Tattoo',
      authorName: 'Stieg Larsson',
      genre: 'Mystery',
      price: 18.50,
      published: '2005',
      isbn: '978-0307454546'
    },
    {
      id: '4',
      title: 'Dune',
      authorName: 'Frank Herbert',
      genre: 'Science Fiction',
      price: 22.95,
      published: '1965',
      isbn: '978-0441172719'
    },
  ];

  getAll(): Observable<Book[]> {
    return of([...this.mockBooks]).pipe(delay(500));
  }

  getById(id: string): Observable<Book> {
    const book = this.mockBooks.find(b => b.id === id);
    if (book) {
      return of({ ...book }).pipe(delay(300));
    }
    return throwError(() => new Error('Book not found'));
  }

  create(book: Omit<Book, 'id'>): Observable<Book> {
    const newBook = {
      ...book,
      id: String(this.mockBooks.length + 1)
    };
    this.mockBooks.push(newBook);
    return of({ ...newBook }).pipe(delay(400));
  }

  update(id: string, updates: Partial<Book>): Observable<Book> {
    const index = this.mockBooks.findIndex(b => b.id === id);
    if (index !== -1) {
      this.mockBooks[index] = { ...this.mockBooks[index], ...updates };
      return of({ ...this.mockBooks[index] }).pipe(delay(400));
    }
    return throwError(() => new Error('Book not found'));
  }

  delete(id: string): Observable<void> {
    const index = this.mockBooks.findIndex(b => b.id === id);
    if (index !== -1) {
      this.mockBooks.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Book not found'));
  }
}
