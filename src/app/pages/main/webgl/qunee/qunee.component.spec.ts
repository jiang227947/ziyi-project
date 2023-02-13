import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuneeComponent } from './qunee.component';

describe('QuneeComponent', () => {
  let component: QuneeComponent;
  let fixture: ComponentFixture<QuneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuneeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
