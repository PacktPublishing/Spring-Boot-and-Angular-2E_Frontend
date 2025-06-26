import { Component, input, output } from '@angular/core';
import { Book } from '../../../../shared/models/book';

@Component({
  standalone: true,
  selector: 'book-list',
  templateUrl: './book-list.html',
})
export class BookList {
  books = input<Book[]>([]);
  book = output<Book>();

  selectBook(book: Book) {
    this.book.emit(book);
  }
}
