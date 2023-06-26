import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoboxComponent } from './user-infobox.component';

describe('UserInfoboxComponent', () => {
  let component: UserInfoboxComponent;
  let fixture: ComponentFixture<UserInfoboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInfoboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfoboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
