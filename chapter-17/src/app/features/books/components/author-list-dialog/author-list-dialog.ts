import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { injectDispatch } from '@ngrx/signals/events';
import { Author } from '../../../../shared/models/author';
import { authorPageEvents } from '../../store/author-store/author.events';
import { AuthorStore } from '../../store/author-store/author.store';
import { AuthorForm } from '../author-form/author-form';

@Component({
  selector: 'author-list-dialog',
  templateUrl: './author-list-dialog.html',
  styleUrl: './author-list-dialog.scss',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatDialogModule,
  ],
})
export class AuthorListDialog implements OnInit {
  protected readonly store = inject(AuthorStore);
  private dialogRef = inject(MatDialogRef<AuthorListDialog>);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  protected readonly dispatch = injectDispatch(authorPageEvents);

  displayedColumns = ['name', 'nationality', 'books', 'actions'];
  searchTerm = '';

  ngOnInit() {
    this.dispatch.loadAuthors({
      page: 0,
      size: 10,
    });
  }

  onPageChange(event: PageEvent) {
    this.dispatch.loadAuthors({
      page: event.pageIndex,
      size: event.pageSize,
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.dispatch.searchByName({
        name: this.searchTerm,
      });
    } else {
      this.dispatch.loadAuthors({
        page: 0,
        size: 10,
      });
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.dispatch.loadAuthors({
      page: 0,
      size: 10,
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AuthorForm, {
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dispatch.createSubmitted(result);
        this.snackBar.open('Author created successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(author: Author) {
    const dialogRef = this.dialog.open(AuthorForm, {
      width: '480px',
      data: author,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dispatch.updateSubmitted(result);
        this.snackBar.open('Author updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  confirmDelete(author: Author) {
    if (confirm(`Delete ${author.name}?`)) {
      this.dispatch.deleteConfirmed({
        id: author.id!,
      });
      this.snackBar.open('Author deleted successfully', 'Close', { duration: 3000 });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
