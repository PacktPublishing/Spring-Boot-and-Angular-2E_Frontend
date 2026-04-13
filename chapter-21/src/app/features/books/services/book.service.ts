import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Book, BookRequest } from '../../../shared/models/book';
import { PaginatedResponse } from '../../../shared/models/paginated';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/inventory/api/books`;

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }

  getPaged(page: number, size: number): Observable<PaginatedResponse<Book>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PaginatedResponse<Book>>(`${this.baseUrl}/paged`, { params });
  }

  searchByTitle(title: string): Observable<Book[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<Book[]>(`${this.baseUrl}/by-title`, { params });
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  create(book: BookRequest): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, book);
  }

  update(id: number, book: BookRequest): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
