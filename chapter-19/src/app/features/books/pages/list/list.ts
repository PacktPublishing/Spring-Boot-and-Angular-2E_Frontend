import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BookList } from '../../components/book-list/book-list';
import { Book } from '../../../../shared/models/book';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [BookList, MatButtonModule, MatIconModule],
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

  displayedColumns = ['title', 'author', 'genre', 'price', 'published', 'actions'];

  private locallyCreatedIsbns = new Set<string>();

  ngOnInit() {
    this.dispatch.loadBooks({
      page: 0,
      size: 10,
    });
    this.notificationService
      .connect()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notification) => {
        if (notification.isbn && this.locallyCreatedIsbns.has(notification.isbn)) {
          this.locallyCreatedIsbns.delete(notification.isbn);
          return;
        }
        this.snackBar.open(`📚 New book added: ` + `${notification.bookTitle}`, 'Dismiss', {
          duration: 5000,
        });
        this.dispatch.loadBooks({
          page: this.store.currentPage(),
          size: this.store.pageSize(),
        });
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
        this.locallyCreatedIsbns.add(result.isbn);
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
