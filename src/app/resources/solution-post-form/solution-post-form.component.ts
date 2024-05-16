import { Component, signal } from '@angular/core';
import { Solution } from '../../models/solution';
import { FormPostComponent } from '../form-post/form-post.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-solution-post-form',
  standalone: true,
  imports: [FormPostComponent, ReactiveFormsModule],
  templateUrl: './solution-post-form.component.html',
  styles: ``
})
export class SolutionPostFormComponent {

  solution = signal<Solution>({})

  solutionForm = this.formBuilder.group({
    description : ['', Validators.maxLength(250)]
  })

  createSolution(event : SubmitEvent){
    event.preventDefault()
    
  }
  constructor(
    public formBuilder : FormBuilder
  ){}

}
