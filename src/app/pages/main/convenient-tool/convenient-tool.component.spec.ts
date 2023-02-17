import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenientToolComponent } from './convenient-tool.component';

describe('ConvenientToolComponent', () => {
  let component: ConvenientToolComponent;
  let fixture: ComponentFixture<ConvenientToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvenientToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenientToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
