import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Book } from '../../../../shared/models/book';

// Custom validator functions
function isbnValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) return null;
    // Basic ISBN-10 or ISBN-13 validation
    const isbn = control.value.replace(/[-\s]/g, '');
    const isValidLength = isbn.length === 10 || isbn.length === 13;
    const isNumeric = /^\d+$/.test(isbn.slice(0, -1)) && /[\dXx]$/.test(isbn);
    return isValidLength && isNumeric ? null : { invalidIsbn: { value: control.value } };
  };
}

function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl<number>): ValidationErrors | null => {
    if (!control.value) return null;
    return control.value > 0 ? null : { positiveNumber: { value: control.value } };
  };
}

function urlValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) return null;
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: { value: control.value } };
    }
  };
}

@Component({
  selector: 'app-book-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './book-create.html',
  styleUrl: './book-create.scss'
})
export class BookCreate {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BookCreate>);

  // Output event for parent component communication
  bookCreate = output<Book>();

  // Available book genres
  genres = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Technology',
    'Health',
    'Travel',
    'Cooking',
    'Art',
    'Poetry'
  ];

  // Complex reactive form with validation
  bookForm = this.fb.group({
    // Required fields section
    basicInfo: this.fb.group({
      title: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
        nonNullable: true
      }),
      authorName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
        nonNullable: true
      }),
      genre: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      price: this.fb.control<number | null>(null, {
        validators: [Validators.required, positiveNumberValidator()]
      }),
      published: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(/^\d{4}$/)],
        nonNullable: true
      })
    }),
    // Optional fields section
    additionalInfo: this.fb.group({
      description: this.fb.control('', {
        validators: [Validators.maxLength(1000)],
        nonNullable: true
      }),
      isbn: this.fb.control('', {
        validators: [Validators.required, isbnValidator()],
        nonNullable: true
      }),
      pageCount: this.fb.control<number | null>(null, {
        validators: [positiveNumberValidator(), Validators.max(10000)]
      }),
      coverImageUrl: this.fb.control('', {
        validators: [urlValidator()],
        nonNullable: true
      })
    })
  });

  // Signal-based reactive state management
  readonly isFormValid = toSignal(
    this.bookForm.statusChanges.pipe(
      map(status => status === 'VALID')
    ),
    { initialValue: this.bookForm.valid }
  );

  readonly priceValue = toSignal(
    this.bookForm.get('basicInfo.price')!.valueChanges.pipe(
      map(price => price || 0)
    ),
    { initialValue: 0 }
  );

  // Form group accessors
  get basicInfoGroup() {
    return this.bookForm.get('basicInfo');
  }

  get additionalInfoGroup() {
    return this.bookForm.get('additionalInfo');
  }

  // Form interaction methods
  onSubmit() {
    if (this.bookForm.valid) {
      const formData = this.bookForm.value;

      // Reconstruct the data to match our interface
      const bookData: Book = {
        title: formData.basicInfo!.title!,
        authorName: formData.basicInfo!.authorName!,
        genre: formData.basicInfo!.genre!,
        price: formData.basicInfo!.price!,
        published: formData.basicInfo!.published!,
        isbn: formData.additionalInfo!.isbn!,
        description: formData.additionalInfo!.description || undefined,
        pageCount: formData.additionalInfo!.pageCount || undefined,
        coverImageUrl: formData.additionalInfo!.coverImageUrl || undefined
      };

      this.bookCreate.emit(bookData);
      this.resetForm();
      this.dialogRef.close(bookData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  resetForm() {
    this.bookForm.reset();
    // Reset to default values for better UX
    this.bookForm.patchValue({
      basicInfo: {
        title: '',
        authorName: '',
        genre: '',
        published: ''
      },
      additionalInfo: {
        description: '',
        isbn: '',
        coverImageUrl: ''
      }
    });
    // Mark fields as untouched to clear validation errors
    this.bookForm.markAsUntouched();
  }

  // Utility methods
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getErrorMessage(fieldName: string, groupName?: string): string {
    const field = groupName
      ? this.bookForm.get(`${groupName}.${fieldName}`)
      : this.bookForm.get(fieldName);

    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }
    if (field.hasError('minlength')) {
      const requiredLength = field.getError('minlength').requiredLength;
      return `${this.formatFieldName(fieldName)} must be at least ${requiredLength} characters`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `${this.formatFieldName(fieldName)} cannot exceed ${maxLength} characters`;
    }
    if (field.hasError('pattern')) {
      return 'Please enter a valid 4-digit year';
    }
    if (field.hasError('positiveNumber')) {
      return `${this.formatFieldName(fieldName)} must be a positive number`;
    }
    if (field.hasError('max')) {
      const maxValue = field.getError('max').max;
      return `${this.formatFieldName(fieldName)} cannot exceed ${maxValue}`;
    }
    if (field.hasError('invalidIsbn')) {
      return 'Please enter a valid ISBN-10 or ISBN-13';
    }
    if (field.hasError('invalidUrl')) {
      return 'Please enter a valid URL';
    }

    return '';
  }

  private formatFieldName(fieldName: string): string {
    const formatted = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
    // Handle special cases
    if (fieldName === 'isbn') return 'ISBN';
    if (fieldName === 'coverImageUrl') return 'Cover Image URL';
    if (fieldName === 'pageCount') return 'Page Count';
    return formatted;
  }
}
