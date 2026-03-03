import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookForm } from './book-form';

describe('BookForm', () => {
  let component: BookForm;
  let fixture: ComponentFixture<BookForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookForm],
    }).compileComponents();

    fixture = TestBed.createComponent(BookForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
