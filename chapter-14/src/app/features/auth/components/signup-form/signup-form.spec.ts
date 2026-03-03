import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupForm } from './signup-form';

describe('SignupForm', () => {
  let component: SignupForm;
  let fixture: ComponentFixture<SignupForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
