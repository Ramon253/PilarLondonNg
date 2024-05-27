import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentFormComponent } from './create-student-form.component';

describe('CreateStudentFormComponent', () => {
  let component: CreateStudentFormComponent;
  let fixture: ComponentFixture<CreateStudentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStudentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateStudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
