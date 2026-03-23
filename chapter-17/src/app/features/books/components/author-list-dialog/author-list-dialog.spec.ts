import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorListDialog } from './author-list-dialog';

describe('AuthorListDialog', () => {
  let component: AuthorListDialog;
  let fixture: ComponentFixture<AuthorListDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorListDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorListDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
