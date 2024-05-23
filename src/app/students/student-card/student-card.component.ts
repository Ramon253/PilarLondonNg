import {Component, input, output, signal} from '@angular/core';
import {Student} from "../../models/student";
import {environment} from "../../../environments/environment.development";
import {DialogComponent} from "../../dialog/dialog.component";
import {GroupService} from "../../services/group.service";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";

@Component({
  selector: 'app-student-card',
  standalone: true,
    imports: [
        DialogComponent,
        LoadingWheelComponent
    ],
  templateUrl: './student-card.component.html',
  styles: ``
})
export class StudentCardComponent {
    student = input.required<Student>()
    showDeleteDialog = signal<boolean>(false)
    isLoading = signal<boolean>(false);
    leaveClass = output<string>()

    protected readonly environment = environment;
}
