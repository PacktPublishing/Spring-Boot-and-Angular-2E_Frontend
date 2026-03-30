import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Book } from '../../../../shared/models/book';

@Component({
  selector: 'book-list',
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.scss'],
  imports: [CurrencyPipe, MatTableModule, MatIconModule, MatButtonModule],
})
export class BookList {
  books = input<Book[]>([]);
  book = output<Book>();
  editBookEvent = output<Book>();
  deleteBookEvent = output<Book>();

  columns: string[] = ['title', 'author', 'genre', 'price', 'published', 'actions'];

  selectBook(book: Book) {
    this.book.emit(book);
  }

  editBook(book: Book) {
    this.editBookEvent.emit(book);
  }

  deleteBook(book: Book) {
    this.deleteBookEvent.emit(book);
  }
}
