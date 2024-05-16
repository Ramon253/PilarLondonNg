import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionPostFormComponent } from './solution-post-form.component';

describe('SolutionPostFormComponent', () => {
  let component: SolutionPostFormComponent;
  let fixture: ComponentFixture<SolutionPostFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionPostFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolutionPostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
