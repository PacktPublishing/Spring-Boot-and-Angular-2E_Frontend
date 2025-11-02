import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookList } from '../../components/book-list/book-list';
import { BookStore } from '../../store/book.store';
import { injectDispatch } from '@ngrx/signals/events';
import { bookPageEvents } from '../../store/book.events';
import { Book } from '../../../../shared/models/book';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'books-list-page',
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
  imports: [
    BookList,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
})
export class List implements OnInit {
  protected readonly store = inject(BookStore);
  private readonly router = inject(Router);
  protected readonly dispatch = injectDispatch(bookPageEvents);

  ngOnInit() {
    this.dispatch.opened();
  }

  onSelectBook(book: Book) {
    this.dispatch.bookSelected({ id: book.id ?? null });
    this.router.navigate(['/books', book.id]);
  }

  onEditBook(book: Book) {
    if (!book.id) {
      console.error('Cannot edit book without an ID');
      return;
    }
    this.router.navigate(['/books', 'edit', book.id]);
  }

  onDeleteBook(id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.dispatch.deleteRequested({ id });
    }
  }

  onCreateBook() {
    this.router.navigate(['/books', 'create']);
  }

  onSearchChange(term: string) {
    this.dispatch.searchTermChanged({ term });
  }

  onGenreFilterChange(genre: string | null) {
    this.dispatch.genreFilterChanged({ genre });
  }

  onSortOrderChange() {
    const newOrder = this.store.sortOrder() === 'asc' ? 'desc' : 'asc';
    this.dispatch.sortOrderChanged({ order: newOrder });
  }
}
