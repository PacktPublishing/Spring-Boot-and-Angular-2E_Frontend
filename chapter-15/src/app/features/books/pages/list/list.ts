import { Component, inject } from '@angular/core';
import { BookList } from '../../components/book-list/book-list';
import { Book } from '../../../../shared/models/book';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookForm } from '../../components/book-form/book-form';

@Component({
  selector: 'book-list-page',
  imports: [BookList, MatButtonModule, MatIconModule],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  private dialog = inject(MatDialog);

  books: Book[] = [
    {
      title: 'Clean Code',
      authorName: 'Robert C. Martin',
      genre: 'Software Engineering',
      price: 29.99,
      published: '2008-08-01',
      isbn: '978-0132350884',
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      authorName: 'Yuval Noah Harari',
      genre: 'History',
      price: 18.99,
      published: '2011-01-01',
      isbn: '978-0062316097',
    },
    {
      title: 'The Great Gatsby',
      authorName: 'F. Scott Fitzgerald',
      genre: 'Classic Fiction',
      price: 12.49,
      published: '1925-04-10',
      isbn: '978-0743273565',
    },
    {
      title: 'Thinking, Fast and Slow',
      authorName: 'Daniel Kahneman',
      genre: 'Psychology',
      price: 16.99,
      published: '2011-10-25',
      isbn: '978-0374533557',
    },
  ];

  headers: { headerName: string; fieldName: keyof Book }[] = [
    { headerName: 'Title', fieldName: 'title' },
    { headerName: 'Author', fieldName: 'authorName' },
    { headerName: 'Genre', fieldName: 'genre' },
    { headerName: 'Price', fieldName: 'price' },
    { headerName: 'Published', fieldName: 'published' },
  ];

  openCreateDialog() {
    const dialogRef = this.dialog.open(BookForm, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Book created:', result);
        // this will call BookStore.addBook()
      }
    });
  }

  openEditDialog(book: Book) {
    const dialogRef = this.dialog.open(BookForm, {
      width: '600px',
      data: book,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Book updated:', result);
        // this will call BookStore.updateBook()
      }
    });
  }

  selectBook(book: Book): void {
    // handle selection logic
  }
}
