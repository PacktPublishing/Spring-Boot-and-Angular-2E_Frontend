import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookList } from '../../components/book-list/book-list';
import { Book } from '../../../../shared/models/book';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BookForm } from '../../components/book-form/book-form';
import { AuthorListDialog } from '../../components/author-list-dialog/author-list-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { injectDispatch } from '@ngrx/signals/events';
import { bookPageEvents } from '../../store/book-store/book.events';
import { BookStore } from '../../store/book-store/book.store';

@Component({
  selector: 'book-list-page',
  imports: [
    BookList,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit {
  protected readonly store = inject(BookStore);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  protected readonly dispatch = injectDispatch(bookPageEvents);

  searchTerm = '';

  ngOnInit() {
    this.dispatch.loadBooks({
      page: 0,
      size: 10,
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.dispatch.searchByTitle({
        title: this.searchTerm,
      });
    } else {
      this.dispatch.loadBooks({
        page: 0,
        size: 10,
      });
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.dispatch.loadBooks({
      page: 0,
      size: 10,
    });
  }

  openAuthorManagement() {
    this.dialog.open(AuthorListDialog, {
      width: '800px',
      maxHeight: '80vh',
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(BookForm, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dispatch.createSubmitted(result);
        this.snackBar.open('Book created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(book: Book) {
    const dialogRef = this.dialog.open(BookForm, {
      width: '600px',
      data: book,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dispatch.updateSubmitted(result);
      }
    });
  }

  confirmDelete(book: Book) {
    if (confirm(`Delete "${book.title}"?`)) {
      this.dispatch.deleteConfirmed({
        id: book.id!,
      });
    }
  }

  // mock method to demonstrate book selection
  selectBook(book: Book) {
    console.log('Selected book:', book);
  }
}
