import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewUsersComponent } from './profile-view-users.component';

describe('ProfileViewUsersComponent', () => {
  let component: ProfileViewUsersComponent;
  let fixture: ComponentFixture<ProfileViewUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileViewUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileViewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
