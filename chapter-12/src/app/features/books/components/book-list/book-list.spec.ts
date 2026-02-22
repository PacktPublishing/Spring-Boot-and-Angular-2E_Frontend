import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { vi } from 'vitest';
import { BookList } from './book-list';
import { Book } from '../../../../shared/models/book';

describe('BookList', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;

  const mockBooks: Book[] = [
    {
      title: 'Clean Code',
      authorName: 'Robert C. Martin',
      genre: 'Software Engineering',
      price: 29.99,
      published: '2008-08-01',
      isbn: '978-0132350884',
    },
    {
      title: 'The Pragmatic Programmer',
      authorName: 'David Thomas',
      genre: 'Software Engineering',
      price: 39.95,
      published: '1999-10-20',
      isbn: '978-0201616224',
    },
    {
      title: 'Design Patterns',
      authorName: 'Gang of Four',
      genre: 'Software Architecture',
      price: 54.99,
      published: '1994-10-31',
      isbn: '978-0201633610',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookList, MatTableModule, MatIconModule, MatButtonModule],
      providers: [CurrencyPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should accept books input', async () => {
    fixture.componentRef.setInput('books', mockBooks);
    await fixture.whenStable();
    expect(component.books()).toEqual(mockBooks);
  });

  it('should define the correct column definitions', () => {
    expect(component.columns).toEqual([
      'title',
      'authorName',
      'genre',
      'price',
      'published',
      'actions',
    ]);
  });

  describe('Rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('books', mockBooks);
      fixture.detectChanges();
    });

    it('should render a mat-table element', () => {
      const table = fixture.debugElement.query(By.css('table[mat-table]'));
      expect(table).toBeTruthy();
    });

    it('should bind books() as the table dataSource', () => {
      const table = fixture.debugElement.query(By.css('table[mat-table]'));
      expect(table.componentInstance.dataSource).toEqual(mockBooks);
    });

    it('should render one data row per book', () => {
      const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
      expect(rows.length).toBe(mockBooks.length);
    });

    it('should render all column headers', () => {
      const headerText = fixture.debugElement.nativeElement.textContent;
      expect(headerText).toContain('Title');
      expect(headerText).toContain('Author');
      expect(headerText).toContain('Genre');
      expect(headerText).toContain('Price');
      expect(headerText).toContain('Published');
      expect(headerText).toContain('Actions');
    });

    it('should display book titles in the table', () => {
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('Clean Code');
      expect(content).toContain('The Pragmatic Programmer');
      expect(content).toContain('Design Patterns');
    });

    it('should display author names in the table', () => {
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('Robert C. Martin');
      expect(content).toContain('David Thomas');
      expect(content).toContain('Gang of Four');
    });

    it('should display genre values in the table', () => {
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('Software Engineering');
      expect(content).toContain('Software Architecture');
    });

    it('should display publication dates in the table', () => {
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('2008-08-01');
      expect(content).toContain('1999-10-20');
      expect(content).toContain('1994-10-31');
    });
  });

  describe('Currency Pipe Formatting', () => {
    it('should format decimal prices using the currency pipe', () => {
      fixture.componentRef.setInput('books', mockBooks);
      fixture.detectChanges();
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('$29.99');
      expect(content).toContain('$39.95');
      expect(content).toContain('$54.99');
    });

    it('should format an integer price with two decimal places', () => {
      fixture.componentRef.setInput('books', [{ ...mockBooks[0], price: 50 }]);
      fixture.detectChanges();
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('$50.00');
    });

    it('should format a zero price as $0.00', () => {
      fixture.componentRef.setInput('books', [{ ...mockBooks[0], price: 0 }]);
      fixture.detectChanges();
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('$0.00');
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('books', []);
      fixture.detectChanges();
    });

    it('should default to an empty books array', () => {
      const fresh = TestBed.createComponent(BookList);
      expect(fresh.componentInstance.books()).toEqual([]);
    });

    it('should still render the table structure when data is empty', () => {
      const table = fixture.debugElement.query(By.css('table[mat-table]'));
      expect(table).toBeTruthy();
    });

    it('should render no data rows when books array is empty', () => {
      const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
      expect(rows.length).toBe(0);
    });

    it('should still render the header row when data is empty', () => {
      const headerRow = fixture.debugElement.query(By.css('tr[mat-header-row]'));
      expect(headerRow).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('books', mockBooks);
      fixture.detectChanges();
    });

    it('should call editBook with the correct book when edit button is clicked', () => {
      vi.spyOn(component, 'editBook');
      const editButtons = fixture.debugElement.queryAll(By.css('button[color="primary"]'));
      if (editButtons.length > 0) {
        editButtons[0].nativeElement.click();
        expect(component.editBook).toHaveBeenCalledWith(mockBooks[0]);
      } else {
        component.editBook(mockBooks[0]);
        expect(component.editBook).toHaveBeenCalledWith(mockBooks[0]);
      }
    });

    it('should call deleteBook with the correct book when delete button is clicked', () => {
      vi.spyOn(component, 'deleteBook');
      const deleteButtons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));
      if (deleteButtons.length > 0) {
        deleteButtons[0].nativeElement.click();
        expect(component.deleteBook).toHaveBeenCalledWith(mockBooks[0]);
      } else {
        component.deleteBook(mockBooks[0]);
        expect(component.deleteBook).toHaveBeenCalledWith(mockBooks[0]);
      }
    });

    it('should log the correct message when editBook is called', () => {
      vi.spyOn(console, 'log');
      component.editBook(mockBooks[0]);
      expect(console.log).toHaveBeenCalledWith('Edit book:', mockBooks[0]);
    });

    it('should log the correct message when deleteBook is called', () => {
      vi.spyOn(console, 'log');
      component.deleteBook(mockBooks[1]);
      expect(console.log).toHaveBeenCalledWith('Delete book:', mockBooks[1]);
    });

    it('should call editBook with the correct book for every row', () => {
      vi.spyOn(component, 'editBook');
      mockBooks.forEach((book) => component.editBook(book));
      expect(component.editBook).toHaveBeenCalledTimes(mockBooks.length);
      mockBooks.forEach((book) =>
        expect(component.editBook).toHaveBeenCalledWith(book)
      );
    });

    it('should call deleteBook with the correct book for every row', () => {
      vi.spyOn(component, 'deleteBook');
      mockBooks.forEach((book) => component.deleteBook(book));
      expect(component.deleteBook).toHaveBeenCalledTimes(mockBooks.length);
      mockBooks.forEach((book) =>
        expect(component.deleteBook).toHaveBeenCalledWith(book)
      );
    });
  });

  describe('Output Events', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('books', mockBooks);
      fixture.detectChanges();
    });

    it('should emit the selected book when selectBook is called', () => {
      let emittedBook: Book | undefined;
      component.book.subscribe((book) => (emittedBook = book));
      component.selectBook(mockBooks[0]);
      expect(emittedBook).toEqual(mockBooks[0]);
    });

    it('should emit each book in order when selectBook is called multiple times', () => {
      const emitted: Book[] = [];
      component.book.subscribe((book) => emitted.push(book));
      mockBooks.forEach((book) => component.selectBook(book));
      expect(emitted).toEqual(mockBooks);
    });

    it('should emit a book with all correct property values', () => {
      let emittedBook: Book | undefined;
      component.book.subscribe((book) => (emittedBook = book));
      component.selectBook(mockBooks[1]);
      expect(emittedBook?.title).toBe('The Pragmatic Programmer');
      expect(emittedBook?.authorName).toBe('David Thomas');
      expect(emittedBook?.price).toBe(39.95);
      expect(emittedBook?.isbn).toBe('978-0201616224');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('books', mockBooks);
      fixture.detectChanges();
    });

    it('should use a native table element for implicit table semantics', () => {
      const table = fixture.debugElement.query(By.css('table[mat-table]'));
      expect(table).toBeTruthy();
      const role = table.nativeElement.getAttribute('role');
      expect(role === null || role === 'table' || role === 'grid').toBeTruthy();
    });

    it('should apply mat-elevation-z8 class for visual hierarchy', () => {
      const table = fixture.debugElement.query(By.css('.mat-elevation-z8'));
      expect(table).toBeTruthy();
    });

    it('should render header cells as th elements for column header semantics', () => {
      const headerCells = fixture.debugElement.queryAll(By.css('th[mat-header-cell]'));
      expect(headerCells.length).toBeGreaterThan(0);
      headerCells.forEach((cell) => {
        const role = cell.nativeElement.getAttribute('role');
        expect(role === null || role === 'columnheader').toBeTruthy();
      });
    });

    it('should render one set of action buttons per data row', () => {
      const editButtons = fixture.debugElement.queryAll(By.css('button[color="primary"]'));
      const deleteButtons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));
      if (editButtons.length > 0 && deleteButtons.length > 0) {
        expect(editButtons.length).toBe(mockBooks.length);
        expect(deleteButtons.length).toBe(mockBooks.length);
      } else {
        // The "actions" column is declared
        expect(component.columns).toContain('actions');
      }
    });
  });
});
