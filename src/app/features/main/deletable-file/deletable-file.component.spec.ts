import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletableFileComponent } from './deletable-file.component';

describe('DeletableFileComponent', () => {
  let component: DeletableFileComponent;
  let fixture: ComponentFixture<DeletableFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletableFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletableFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
