import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCenterComponent } from './account-center.component';

describe('AccountCenterComponent', () => {
  let component: AccountCenterComponent;
  let fixture: ComponentFixture<AccountCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
