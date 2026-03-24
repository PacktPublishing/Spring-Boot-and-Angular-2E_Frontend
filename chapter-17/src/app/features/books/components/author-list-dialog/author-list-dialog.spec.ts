import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { AuthorListDialog } from './author-list-dialog';
import { AuthorStore } from '../../store/author-store/author.store';

describe('AuthorListDialog', () => {
  let component: AuthorListDialog;
  let fixture: ComponentFixture<AuthorListDialog>;

  beforeEach(async () => {
    const dialogRefMock = {
      close: () => undefined,
    };

    const dialogMock = {
      open: () => ({
        afterClosed: () => of(null),
      }),
    };

    const snackBarMock = {
      open: () => undefined,
    };

    const authorStoreMock = {
      loading: () => false,
      error: () => null,
      hasAuthors: () => false,
      authors: () => [],
      isSearching: () => false,
      totalElements: () => 0,
      pageSize: () => 10,
      currentPage: () => 0,
    };

    await TestBed.configureTestingModule({
      imports: [AuthorListDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: AuthorStore, useValue: authorStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorListDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
