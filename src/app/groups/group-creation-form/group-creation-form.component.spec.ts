import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCreationFormComponent } from './group-creation-form.component';

describe('GroupCreationFormComponent', () => {
  let component: GroupCreationFormComponent;
  let fixture: ComponentFixture<GroupCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupCreationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
