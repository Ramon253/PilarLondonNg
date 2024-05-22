import {Component, input, signal} from '@angular/core';
import {Student} from "../../models/student";
import {environment} from "../../../environments/environment.development";
import {DialogComponent} from "../../dialog/dialog.component";

@Component({
  selector: 'app-student-card',
  standalone: true,
    imports: [
        DialogComponent
    ],
  templateUrl: './student-card.component.html',
  styles: ``
})
export class StudentCardComponent {
    student = input.required<Student>()
    showDeleteDialog = signal<boolean>(false)

    protected readonly environment = environment;
}
