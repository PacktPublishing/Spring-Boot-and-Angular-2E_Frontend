import { Component, input, output, inject } from '@angular/core';
import { Book } from '../../../../shared/models/book';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookCreate } from '../book-create/book-create';

@Component({
  standalone: true,
  selector: 'book-list',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss'
})
export class BookList {
  private dialog = inject(MatDialog);

  books = input<Book[]>([]);
  book = output<Book>();
  bookCreated = output<Book>();

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

  openAddBookDialog() {
    const dialogRef = this.dialog.open(BookCreate, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'book-create-dialog'
    });

    // Subscribe to the bookCreate output from the dialog component
    dialogRef.componentInstance.bookCreate.subscribe((bookData: Book) => {
      this.bookCreated.emit(bookData);
    });

    // Handle dialog result
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Book created:', result);
      }
    });
  }
}
