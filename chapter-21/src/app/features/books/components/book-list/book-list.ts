import { Component, computed, inject, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Book } from '../../../../shared/models/book';
import { AuthStore } from '../../../auth/store/auth.store';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { bookPageEvents } from '../../store/book-store/book.events';
import { injectDispatch } from '@ngrx/signals/events';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookStore } from '../../store/book-store/book.store';

@Component({
  selector: 'book-list',
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.scss'],
  imports: [
    CurrencyPipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginator,
    MatProgressSpinnerModule,
  ],
})
export class BookList {
  books = input<Book[]>([]);
  book = output<Book>();
  editBookEvent = output<Book>();
  deleteBookEvent = output<Book>();

  protected readonly store = inject(BookStore);
  protected readonly dispatch = injectDispatch(bookPageEvents);

  protected readonly authStore = inject(AuthStore);
  private readonly baseColumns = ['title', 'author', 'genre', 'price', 'published'];
  readonly columns = computed(() =>
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

  onPageChange(event: PageEvent) {
    this.dispatch.loadBooks({
      page: event.pageIndex,
      size: event.pageSize,
    });
  }
}
