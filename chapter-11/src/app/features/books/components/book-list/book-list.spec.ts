import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  ];

  beforeEach(async () => {
    // Configure TestBed for standalone component
    await TestBed.configureTestingModule({
      imports: [BookList],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
  });

  // Test Case 1: Component Creation
  // Verifies that the component can be instantiated without errors
  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  // Test Case 2: Basic Input Handling
  // Verifies that the component can accept input data
  it('should accept books input', async () => {
    fixture.componentRef.setInput('books', mockBooks);
    await fixture.whenStable();
    expect(component.books()).toEqual(mockBooks);
  });
});
