import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartColumnComponent } from './echart-column.component';

describe('EchartColumnComponent', () => {
  let component: EchartColumnComponent;
  let fixture: ComponentFixture<EchartColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
