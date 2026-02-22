import { Component, input, output } from '@angular/core';
import { Book } from '../../../../shared/models/book';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'book-list',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './book-list.html',
})
export class BookList {
  books = input<Book[]>([]);
  book = output<Book>();

  columns: string[] = ['title', 'author', 'genre', 'price', 'published', 'actions'];

  selectBook(book: Book) {
    this.book.emit(book);
  }

  editBook(book: Book) {
    // @TODO Replace with actual navigation or edit logic
    console.log('Edit book:', book);
  }

  deleteBook(book: Book) {
    // @TODO Replace with actual deletion logic
    console.log('Delete book:', book);
  }
}
