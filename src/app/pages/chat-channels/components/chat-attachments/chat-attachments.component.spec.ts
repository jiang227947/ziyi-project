import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAttachmentsComponent } from './chat-attachments.component';

describe('ChatAttachmentsComponent', () => {
  let component: ChatAttachmentsComponent;
  let fixture: ComponentFixture<ChatAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
