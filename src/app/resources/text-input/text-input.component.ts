import {Component, input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";

@Component({
  selector: 'app-text-input',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ValidationErrorComponent
    ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent {

    form = input.required<FormGroup>()
    input = input.required<string>()
    label = input.required<string>()
    errors = input.required<string[]>()
    classList = input<string>('h-[32%] w-full flex flex-col')
}
