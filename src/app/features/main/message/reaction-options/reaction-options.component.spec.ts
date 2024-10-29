import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionOptionsComponent } from './reaction-options.component';

describe('ReactionOptionsComponent', () => {
  let component: ReactionOptionsComponent;
  let fixture: ComponentFixture<ReactionOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReactionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
