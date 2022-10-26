import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QWeatherComponent } from './q-weather.component';

describe('QWeatherComponent', () => {
  let component: QWeatherComponent;
  let fixture: ComponentFixture<QWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QWeatherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
