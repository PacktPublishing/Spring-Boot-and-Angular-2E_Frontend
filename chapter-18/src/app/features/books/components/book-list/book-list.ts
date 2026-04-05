import { Component, computed, inject, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Book } from '../../../../shared/models/book';
import { AuthStore } from '../../../auth/store/auth.store';

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

  protected readonly authStore = inject(AuthStore);
  private readonly baseColumns = ['title', 'author', 'genre', 'price', 'published'];
  protected readonly columns = computed(() =>
    this.authStore.isAuthenticated() ? [...this.baseColumns, 'actions'] : this.baseColumns,
  );

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
