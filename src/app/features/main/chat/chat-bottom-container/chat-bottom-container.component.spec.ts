import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBottomContainerComponent } from './chat-bottom-container.component';

describe('ChatBottomContainerComponent', () => {
  let component: ChatBottomContainerComponent;
  let fixture: ComponentFixture<ChatBottomContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBottomContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatBottomContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
