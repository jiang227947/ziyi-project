import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingChannelComponent } from './setting-channel.component';

describe('SettingChannelComponent', () => {
  let component: SettingChannelComponent;
  let fixture: ComponentFixture<SettingChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
