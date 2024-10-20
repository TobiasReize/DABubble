import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewLoggedUserComponent } from './profile-view-logged-user.component';

describe('ProfileViewLoggedUserComponent', () => {
  let component: ProfileViewLoggedUserComponent;
  let fixture: ComponentFixture<ProfileViewLoggedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileViewLoggedUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileViewLoggedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
