import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourSolutionCardComponent } from './your-solution-card.component';

describe('YourSolutionCardComponent', () => {
  let component: YourSolutionCardComponent;
  let fixture: ComponentFixture<YourSolutionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourSolutionCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YourSolutionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
