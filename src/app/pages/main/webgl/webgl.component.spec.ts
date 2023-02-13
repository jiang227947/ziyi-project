import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebglComponent } from './webgl.component';

describe('WebglComponent', () => {
  let component: WebglComponent;
  let fixture: ComponentFixture<WebglComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebglComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
