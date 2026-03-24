import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Author } from '../../../../shared/models/author';

@Component({
  selector: 'author-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './author-form.html',
  styleUrl: './author-form.scss',
})
export class AuthorForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AuthorForm>);
  private data: Author | null = inject(MAT_DIALOG_DATA, { optional: true }) ?? null;

  authorForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    nationality: ['', [Validators.required]],
  });

  readonly isFormValid = toSignal(
    this.authorForm.statusChanges.pipe(map((status) => status === 'VALID')),
    { initialValue: this.authorForm.valid },
  );

  get isEditMode(): boolean {
    return this.data !== null;
  }

  constructor() {
    if (this.data) {
      this.authorForm.patchValue({
        name: this.data.name,
        nationality: this.data.nationality,
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.authorForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';
    if (control.hasError('required')) return `${this.formatFieldName(controlName)} is required.`;
    if (control.hasError('minlength')) {
      const err = control.getError('minlength');
      return `Must be at least ${err.requiredLength} characters.`;
    }
    return 'Invalid value.';
  }

  onSubmit() {
    if (this.authorForm.valid) {
      const formValue = this.authorForm.getRawValue();
      if (this.isEditMode) {
        this.dialogRef.close({ id: this.data!.id, ...formValue });
      } else {
        this.dialogRef.close(formValue);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }
}
