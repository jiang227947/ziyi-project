import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckysheetComponent } from './luckysheet.component';

describe('LuckysheetComponent', () => {
  let component: LuckysheetComponent;
  let fixture: ComponentFixture<LuckysheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuckysheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckysheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
