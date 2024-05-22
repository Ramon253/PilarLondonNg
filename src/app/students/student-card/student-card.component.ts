import {Component, input} from '@angular/core';
import {Student} from "../../models/student";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [],
  templateUrl: './student-card.component.html',
  styles: ``
})
export class StudentCardComponent {
    student = input.required<Student>()


    protected readonly environment = environment;
}
