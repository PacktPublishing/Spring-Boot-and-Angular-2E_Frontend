import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { BookStore } from '../../store/book.store';
import { Book } from '../../../../shared/models/book';

@Component({
  selector: 'book-form',
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
  ],
})
export class BookForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(BookStore);

  bookForm!: FormGroup;
  isEditMode = false;
  bookId: string | null = null;

  availableGenres = ['Programming', 'Fiction', 'Fantasy', 'Science Fiction', 'Software Engineering', 'Mystery', 'History', 'Biography'];

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.bookId;

    this.initializeForm();

    if (this.isEditMode && this.bookId) {
      // Wait a bit for the store to load if books are empty
      if (this.store.books().length === 0) {
        // Store might still be loading, wait for it
        setTimeout(() => this.loadBookData(this.bookId!), 100);
      } else {
        this.loadBookData(this.bookId);
      }
    }
  }

  private initializeForm() {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      authorName: ['', [Validators.required, Validators.minLength(3)]],
      genre: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      published: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  private loadBookData(id: string) {
    const book = this.store.books().find(b => b.id === id);

    if (book) {
      // Convert published date string to Date object for datepicker
      const publishedDate = book.published ? new Date(book.published) : null;

      this.bookForm.patchValue({
        title: book.title,
        authorName: book.authorName,
        genre: book.genre,
        price: book.price,
        published: publishedDate,
        isbn: book.isbn,
      });

      console.log('Loaded book data:', book);
      console.log('Form values:', this.bookForm.value);
    } else {
      console.error('Book not found with id:', id);
      console.log('Available books:', this.store.books());
      this.router.navigate(['/books']);
    }
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const formValue = this.bookForm.value;

    // Convert Date object to ISO string for published date
    const bookData = {
      ...formValue,
      published: formValue.published instanceof Date
        ? formValue.published.toISOString().split('T')[0]
        : formValue.published
    };

    if (this.isEditMode && this.bookId) {
      const updatedBook: Book = {
        id: this.bookId,
        ...bookData,
      };
      this.store.updateBook(updatedBook);
    } else {
      const newBook: Omit<Book, 'id'> = bookData;
      this.store.addBook(newBook);
    }

    this.router.navigate(['/books']);
  }

  onCancel() {
    this.router.navigate(['/books']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.bookForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${fieldName} must be at least ${minLength} characters`;
    }

    if (control?.hasError('min')) {
      return `${fieldName} must be greater than 0`;
    }

    return '';
  }
}
