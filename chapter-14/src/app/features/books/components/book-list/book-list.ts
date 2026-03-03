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

  columns: string[] = ['title', 'authorName', 'genre', 'price', 'published', 'actions'];

  selectBook(book: Book) {
    this.book.emit(book);
  }

  editBook(book: Book) {
    console.log('Edit book:', book);
  }

  deleteBook(book: Book) {
    console.log('Delete book:', book);
  }
}
