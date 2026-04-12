import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { Events } from '@ngrx/signals/events';
import { NotificationService } from '../../services/notification.service';
import { BookNotification } from '../../../../shared/models/notification';
import { bookPageEvents } from '../../store/book-store/book.events';

import { List } from './list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let notifications$: Subject<BookNotification>;
  let snackBarOpenSpy: ReturnType<typeof vi.fn>;
  let loadBooksPayloads: Array<{ page: number; size: number }>;

  beforeEach(async () => {
    notifications$ = new Subject<BookNotification>();
    snackBarOpenSpy = vi.fn();

    const dialogOpenSpy = vi.fn(() => ({
      afterClosed: () => new Subject<unknown>(),
    }));

    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        {
          provide: NotificationService,
          useValue: { connect: vi.fn(() => notifications$) },
        },
        { provide: MatSnackBar, useValue: { open: snackBarOpenSpy } },
        { provide: MatDialog, useValue: { open: dialogOpenSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    loadBooksPayloads = [];

    TestBed.inject(Events)
      .on(bookPageEvents.loadBooks)
      .subscribe((event) => {
        loadBooksPayloads.push(event.payload);
      });

    await fixture.whenStable();
    loadBooksPayloads = [];
    snackBarOpenSpy.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show snackbar with title for external notifications', async () => {
    notifications$.next({
      eventType: 'NEW_BOOK',
      bookId: 101,
      bookTitle: 'External Event Book',
      isbn: '9780132350884',
    });

    await fixture.whenStable();

    expect(snackBarOpenSpy).toHaveBeenCalledWith(
      '📚 New book added: External Event Book',
      'Dismiss',
      { duration: 5000 },
    );
  });

  it('should dispatch loadBooks after receiving a notification', async () => {
    notifications$.next({
      eventType: 'NEW_BOOK',
      bookId: 102,
      bookTitle: 'Another External Book',
      isbn: '9780137081073',
    });

    await fixture.whenStable();

    expect(loadBooksPayloads).toContainEqual({
      page: (component as any).store.currentPage(),
      size: (component as any).store.pageSize(),
    });
  });

  it('should suppress notifications matching locally created ISBNs', async () => {
    const isbn = '9781491950296';
    (component as any).locallyCreatedIsbns.add(isbn);
    expect((component as any).locallyCreatedIsbns.has(isbn)).toBe(true);

    notifications$.next({
      eventType: 'NEW_BOOK',
      bookId: 103,
      bookTitle: 'Locally Created Book',
      isbn,
    });

    await fixture.whenStable();

    expect((component as any).locallyCreatedIsbns.has(isbn)).toBe(false);
    expect(snackBarOpenSpy).not.toHaveBeenCalled();
    expect(loadBooksPayloads).toEqual([]);
  });

  it('should clean up notification subscription when component is destroyed', async () => {
    expect(notifications$.observed).toBe(true);

    fixture.destroy();
    await fixture.whenStable();

    expect(notifications$.observed).toBe(false);

    notifications$.next({
      eventType: 'NEW_BOOK',
      bookId: 104,
      bookTitle: 'Book After Destroy',
      isbn: '9780321125217',
    });
    await fixture.whenStable();

    expect(snackBarOpenSpy).not.toHaveBeenCalled();
    expect(loadBooksPayloads).toEqual([]);
  });
});
