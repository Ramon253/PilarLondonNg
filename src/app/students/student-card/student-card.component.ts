import {Component, input} from '@angular/core';
import {Student} from "../../models/student";

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [],
  templateUrl: './student-card.component.html',
  styles: ``
})
export class StudentCardComponent {
    student = input.required<Student>()


}
