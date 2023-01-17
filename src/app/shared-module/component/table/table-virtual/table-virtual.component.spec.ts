import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableVirtualComponent } from './table-virtual.component';

describe('TableVirtualComponent', () => {
  let component: TableVirtualComponent;
  let fixture: ComponentFixture<TableVirtualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableVirtualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
