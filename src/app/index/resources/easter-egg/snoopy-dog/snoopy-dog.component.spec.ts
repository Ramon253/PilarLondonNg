import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnoopyDogComponent } from './snoopy-dog.component';

describe('SnoopyDogComponent', () => {
  let component: SnoopyDogComponent;
  let fixture: ComponentFixture<SnoopyDogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnoopyDogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnoopyDogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
