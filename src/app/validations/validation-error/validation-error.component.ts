import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-validation-error',
  standalone: true,
  imports: [],
  templateUrl: './validation-error.component.html',
  styleUrl: './validation-error.component.css'
})
export class ValidationErrorComponent {
  form = input<FormGroup>(new FormGroup(''))
  field = input<string>('')
  errors = input<string[]>([])
  showError = input<boolean>(false)

  hasErrors() : boolean {
    if (this.showError()) return true
    return (!this.form().get(this.field())?.valid && this.form().get(this.field())?.touched) ?? false;
}
  constructor(
    public validator: ValidationsService
  ){}
}
