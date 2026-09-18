import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
import { AuthStore } from '../../../auth/store/auth.store';
import { NotificationService } from '../../services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  protected readonly authStore = inject(AuthStore);

  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);

  private locallyCreatedIsbns = new Set<string>();

  searchTerm = '';

  ngOnInit() {
    this.dispatch.loadBooks({
      page: 0,
      size: 10,
    });
    this.notificationService
      .connect()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification) => {
        const normalizedIsbn = notification.isbn ? this.normalizeIsbn(notification.isbn) : null;
        if (normalizedIsbn && this.locallyCreatedIsbns.has(normalizedIsbn)) {
          this.locallyCreatedIsbns.delete(normalizedIsbn);
          return;
        }
        this.snackBar.open(`📚 New book added: ` + `${notification.bookTitle}`, 'Dismiss', {
          duration: 5000,
        });
        if (!this.store.isSearching()) {
          this.dispatch.loadBooks({
            page: this.store.currentPage(),
            size: this.store.pageSize(),
          });
        }
      });
  }

  private normalizeIsbn(isbn: string): string {
    return isbn.replace(/[-\s]/g, '');
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
      width: '560px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.locallyCreatedIsbns.add(this.normalizeIsbn(result.isbn));
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
