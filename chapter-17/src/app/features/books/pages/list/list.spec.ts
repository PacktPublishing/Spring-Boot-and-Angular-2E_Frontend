import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Events } from '@ngrx/signals/events';
import { bookPageEvents } from '../../store/book-store/book.events';

import { List } from './list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let searchByTitlePayloads: Array<{ title: string }>;
  let loadBooksPayloads: Array<{ page: number; size: number }>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;

    searchByTitlePayloads = [];
    loadBooksPayloads = [];

    const events = TestBed.inject(Events);
    events.on(bookPageEvents.searchByTitle).subscribe((event) => {
      searchByTitlePayloads.push(event.payload);
    });
    events.on(bookPageEvents.loadBooks).subscribe((event) => {
      loadBooksPayloads.push(event.payload);
    });

    await fixture.whenStable();
    loadBooksPayloads = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch searchByTitle when the search term is non-blank', () => {
    component.searchTerm = 'Clean Code';
    component.onSearch();

    expect(searchByTitlePayloads).toContainEqual({ title: 'Clean Code' });
  });

  it('should dispatch loadBooks when the search term is blank', () => {
    component.searchTerm = '   ';
    component.onSearch();

    expect(loadBooksPayloads).toContainEqual({ page: 0, size: 10 });
  });

  it('should reset the search term and reload on clearSearch', () => {
    component.searchTerm = 'Clean Code';
    component.clearSearch();

    expect(component.searchTerm).toBe('');
    expect(loadBooksPayloads).toContainEqual({ page: 0, size: 10 });
  });
});
