import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBaseComponent } from './chat-base.component';

describe('ChatBaseComponent', () => {
  let component: ChatBaseComponent;
  let fixture: ComponentFixture<ChatBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
