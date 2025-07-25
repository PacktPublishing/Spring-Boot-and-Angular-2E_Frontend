# Forms Development Patterns

## Reactive Forms Standard
All forms in this application must use reactive forms with these patterns:

### Form Structure
```typescript
export class ExampleForm {
  private fb = inject(FormBuilder);
  
  formName = this.fb.group({
    // Use nonNullable: true for required fields to avoid null types
    field: this.fb.control('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    // Nested groups for complex objects
    nested: this.fb.group({
      subField: this.fb.control('', { nonNullable: true })
    })
  });

  // Signal-based form state
  readonly formValue = toSignal(this.formName.valueChanges, {
    initialValue: this.formName.value
  });
}
```

### Validation Patterns
Use built-in validators: Validators.required, Validators.email, Validators.minLength()
Create custom validators for business logic
Display errors only when field is touched and invalid
Use consistent error message patterns

### Template Patterns
```html
<mat-form-field appearance="outline">
  <mat-label>Field Label</mat-label>
  <input matInput formControlName="fieldName" placeholder="Enter value">
  @if (form.get('fieldName')?.invalid && form.get('fieldName')?.touched) {
    <mat-error>{{ getErrorMessage('fieldName') }}</mat-error>
  }
</mat-form-field>
```

### Error Handling
Implement consistent error message methods:
```typescript
getErrorMessage(fieldName: string, groupName?: string): string {
  const control = groupName 
    ? this.form.get(`${groupName}.${fieldName}`)
    : this.form.get(fieldName);
    
  if (control?.hasError('required')) return 'This field is required';
  if (control?.hasError('email')) return 'Please enter a valid email';
  return '';
}
```

### Form Submission
- Always check form validity before submission
- Provide user feedback during submission
- Handle both success and error states
- Emit events to parent components for data flow