import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBoxComponent } from './map-box.component';

describe('MapBoxComponent', () => {
  let component: MapBoxComponent;
  let fixture: ComponentFixture<MapBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
