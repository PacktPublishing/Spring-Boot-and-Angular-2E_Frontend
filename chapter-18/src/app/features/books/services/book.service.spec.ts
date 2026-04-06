import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch paginated books from /paged endpoint', () => {
    service.getPaged(0, 10).subscribe((res) => {
      expect(res.content.length).toBe(2);
      expect(res.totalElements).toBe(2);
    });

    const req = httpMock.expectOne((r) => r.url.includes('/books/paged'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    req.flush({
      content: [
        {
          id: 1,
          title: 'Clean Code',
          author: { id: 1, name: 'Robert C. Martin', nationality: '' },
          genre: 'Software Engineering',
          isbn: '9780132350884',
          published: '2008-08-01',
          price: 29.99,
        },
        {
          id: 2,
          title: 'Domain-Driven Design',
          author: { id: 2, name: 'Eric Evans', nationality: '' },
          genre: 'Software Engineering',
          isbn: '9780321125217',
          published: '2003-08-30',
          price: 39.99,
        },
      ],
      totalElements: 2,
      totalPages: 1,
      pageNumber: 0,
      pageSize: 10,
      first: true,
      last: true,
      empty: false,
      numberOfElements: 2,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
    });
  });

  it('should create a book', () => {
    const book = {
      title: 'Effective TypeScript',
      isbn: '9781492053743',
      published: '2019-10-15',
      price: 34.99,
      genre: 'Programming',
      authorId: 1,
    };

    service.create(book).subscribe((res) => {
      expect(res.id).toBe(5);
      expect(res.title).toBe(book.title);
    });

    const req = httpMock.expectOne((r) => r.url.includes('/books') && !r.url.includes('/paged'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(book);
    req.flush({
      id: 5,
      title: book.title,
      isbn: book.isbn,
      published: book.published,
      price: book.price,
      genre: book.genre,
      author: { id: 1, name: 'Dan Vanderkam', nationality: '' },
    });
  });

  it('should delete a book', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/books/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
