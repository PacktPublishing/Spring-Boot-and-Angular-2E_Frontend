import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectDispatch } from '@ngrx/signals/events';
import { map } from 'rxjs';
import { Book, BookRequest } from '../../../../shared/models/book';
import { authorPageEvents } from '../../store/author-store/author.events';
import { AuthorStore } from '../../store/author-store/author.store';

type BookDialogData = Book & { id?: number };

const ISBN_PATTERN = /^(?:\d{9}[\dXx]|\d{13})$/;
const URL_PATTERN = /^https?:\/\/.+\..+/;

export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Horror',
  'Biography',
  'History',
  'Science',
  'Technology',
  'Self-Help',
  'Children',
  'Other',
];

@Component({
  selector: 'app-book-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss',
})
export class BookForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BookForm>);
  private data: BookDialogData | null = inject(MAT_DIALOG_DATA, { optional: true }) ?? null;
  readonly authorStore = inject(AuthorStore);
  private readonly dispatch = injectDispatch(authorPageEvents);

  readonly genres = BOOK_GENRES;

  bookForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.pattern(ISBN_PATTERN)]],
    authorId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    price: [0, [Validators.required, Validators.min(0)]],
    genre: ['', [Validators.required]],
    published: this.fb.control<Date | null>(null, [Validators.required]),
    description: [''],
    pageCount: this.fb.control<number | null>(null, [Validators.min(1)]),
    coverImageUrl: ['', [Validators.pattern(URL_PATTERN)]],
  });

  readonly isFormValid = toSignal(
    this.bookForm.statusChanges.pipe(map((status) => status === 'VALID')),
    { initialValue: this.bookForm.valid },
  );

  get isEditMode(): boolean {
    return this.data !== null;
  }

  constructor() {
    this.dispatch.loadAuthors({
      page: 0,
      size: 100,
    });

    if (this.data) {
      this.bookForm.patchValue({
        title: this.data.title,
        isbn: this.data.isbn,
        authorId: this.data.author.id ?? null,
        price: this.data.price,
        genre: this.data.genre,
        published: this.data.published ? new Date(this.data.published) : null,
        description: this.data.description ?? '',
        pageCount: this.data.pageCount ?? null,
        coverImageUrl: this.data.coverImageUrl ?? '',
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.bookForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.hasError('required')) return `${this.formatFieldName(controlName)} is required.`;
    if (control.hasError('pattern')) {
      if (controlName === 'isbn') return 'Invalid ISBN format (10 or 13 digits).';
      if (controlName === 'coverImageUrl')
        return 'Must be a valid URL starting with http or https.';
    }
    if (control.hasError('min')) {
      if (controlName === 'price') return 'Price must be 0 or greater.';
      if (controlName === 'pageCount') return 'Page count must be at least 1.';
    }
    return 'Invalid value.';
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.getRawValue();
      const publishedStr = formValue.published
        ? (formValue.published as Date).toISOString().split('T')[0]
        : '';
      const selectedAuthorId = formValue.authorId;

      if (selectedAuthorId === null) {
        return;
      }

      const bookData: BookRequest = {
        title: formValue.title,
        isbn: formValue.isbn,
        authorId: selectedAuthorId,
        price: formValue.price,
        genre: formValue.genre,
        published: publishedStr,
        ...(formValue.description ? { description: formValue.description } : {}),
        ...(formValue.pageCount != null ? { pageCount: formValue.pageCount } : {}),
        ...(formValue.coverImageUrl ? { coverImageUrl: formValue.coverImageUrl } : {}),
      };

      if (this.isEditMode && this.data?.id != null) {
        this.dialogRef.close({ id: this.data.id, ...bookData });
      } else {
        this.dialogRef.close(bookData);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }
}
