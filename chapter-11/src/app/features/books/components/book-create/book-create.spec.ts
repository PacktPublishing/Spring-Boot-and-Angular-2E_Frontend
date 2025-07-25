import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCreate } from './book-create';

describe('BookCreate', () => {
  let component: BookCreate;
  let fixture: ComponentFixture<BookCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
