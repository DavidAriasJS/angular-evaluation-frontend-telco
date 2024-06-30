import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDialogComponent } from './author-dialog.component';

describe('AuthorModalComponent', () => {
  let component: AuthorDialogComponent;
  let fixture: ComponentFixture<AuthorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
