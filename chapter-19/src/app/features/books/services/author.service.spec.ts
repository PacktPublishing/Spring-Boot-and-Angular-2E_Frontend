import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthorService } from './author.service';

describe('AuthorService', () => {
  let service: AuthorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch paginated authors', () => {
    service.getPaged(0, 10).subscribe((res) => {
      expect(res.content.length).toBe(2);
    });

    const req = httpMock.expectOne((r) => r.url.includes('/authors/paged'));
    expect(req.request.method).toBe('GET');
    req.flush({
      content: [
        { id: 1, name: 'Author 1', nationality: 'USA', books: [] },
        { id: 2, name: 'Author 2', nationality: 'UK', books: [] },
      ],
      totalElements: 2,
      totalPages: 1,
    });
  });

  it('should create an author', () => {
    const author = {
      name: 'New Author',
      nationality: 'Greece',
    };
    service.create(author).subscribe((res) => {
      expect(res.id).toBe(5);
    });

    const req = httpMock.expectOne((r) => r.url.includes('/authors') && !r.url.includes('/paged'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(author);
    req.flush({ id: 5, ...author, books: null });
  });

  it('should delete an author', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/authors/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null, {
      status: 204,
      statusText: 'No Content',
    });
  });
});
