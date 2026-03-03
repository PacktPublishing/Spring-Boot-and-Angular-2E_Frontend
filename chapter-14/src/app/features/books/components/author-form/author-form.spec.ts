import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorForm } from './author-form';

describe('AuthorForm', () => {
  let component: AuthorForm;
  let fixture: ComponentFixture<AuthorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
