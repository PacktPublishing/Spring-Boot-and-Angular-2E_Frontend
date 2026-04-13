import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Author } from '../../../shared/models/author';
import { PaginatedResponse } from '../../../shared/models/paginated';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/inventory/api/authors`;

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.baseUrl);
  }

  getPaged(page: number, size: number): Observable<PaginatedResponse<Author>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PaginatedResponse<Author>>(`${this.baseUrl}/paged`, { params });
  }

  searchByName(name: string): Observable<Author[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Author[]>(`${this.baseUrl}/by-name-ignore-case`, { params });
  }

  getById(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.baseUrl}/${id}`);
  }

  create(author: Omit<Author, 'id'>): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, author);
  }

  update(id: number, author: Omit<Author, 'id'>): Observable<Author> {
    return this.http.put<Author>(`${this.baseUrl}/${id}`, author);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
