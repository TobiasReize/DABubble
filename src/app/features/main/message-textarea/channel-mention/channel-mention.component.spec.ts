import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMentionComponent } from './channel-mention.component';

describe('ChannelMentionComponent', () => {
  let component: ChannelMentionComponent;
  let fixture: ComponentFixture<ChannelMentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelMentionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelMentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
