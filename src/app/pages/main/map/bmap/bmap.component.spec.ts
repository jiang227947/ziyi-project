import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmapComponent } from './bmap.component';

describe('BmapComponent', () => {
  let component: BmapComponent;
  let fixture: ComponentFixture<BmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
