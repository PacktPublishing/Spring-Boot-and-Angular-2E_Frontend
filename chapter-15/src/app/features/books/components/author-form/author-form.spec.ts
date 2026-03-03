import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { vi } from 'vitest';

import { AuthorForm } from './author-form';

describe('AuthorForm', () => {
  let component: AuthorForm;
  let fixture: ComponentFixture<AuthorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorForm],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
