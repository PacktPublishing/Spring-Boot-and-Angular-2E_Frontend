import { Component, input, output } from '@angular/core';
import { Book } from '../../../../shared/models/book';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'book-list',
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.scss'],
  imports: [MatTableModule, MatButtonModule, MatIconModule, CurrencyPipe, DatePipe],
})
export class BookList {
  books = input<Book[]>([]);
  bookSelected = output<Book>();
  bookEdit = output<Book>();
  bookDelete = output<string>();

  displayedColumns = ['title', 'author', 'genre', 'price', 'published', 'actions'];

  onRowClick(book: Book) {
    this.bookSelected.emit(book);
  }

  onEdit(event: Event, book: Book) {
    event.stopPropagation();
    this.bookEdit.emit(book);
  }

  onDelete(event: Event, bookId: string) {
    event.stopPropagation();
    this.bookDelete.emit(bookId);
  }
}
