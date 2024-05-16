import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourSolutionComponent } from './your-solution.component';

describe('YourSolutionComponent', () => {
  let component: YourSolutionComponent;
  let fixture: ComponentFixture<YourSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourSolutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YourSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
