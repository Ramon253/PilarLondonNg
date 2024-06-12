import {Component, input, output, signal} from '@angular/core';
import {DialogComponent} from "../../dialog/dialog.component";
import {FileComponent} from "../../resources/file/file.component";
import {LinkComponent} from "../../resources/link/link.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {MultimediaComponent} from "../../multimedia/multimedia.component";
import {RouterLink} from "@angular/router";
import {YoutubeVideoComponent} from "../../posts/youtube-video/youtube-video.component";
import {LoginService} from "../../login.service";
import {Assignment} from "../../models/assignment";
import {AssignmentService} from "../../services/assignment.service";

@Component({
  selector: 'app-assignment-card',
  standalone: true,
    imports: [
        DialogComponent,
        FileComponent,
        LinkComponent,
        LoadingWheelComponent,
        MultimediaComponent,
        RouterLink,
        YoutubeVideoComponent
    ],
  templateUrl: './assignment-card.component.html',
  styles : ``
})
export class AssignmentCardComponent {

    assignment = input.required<Assignment>()
    showDeleteDialog = signal<boolean>(false)
    delete = output<string>()
    isLoadingDelete = signal<boolean>(false)

    deleteAssignment(){
        this.isLoadingDelete.set(true)
        this.assignmentSvc.deleteAssignment(this.assignment().id ?? '').then(
            res => {
                this.delete.emit(this.assignment().id ?? '')
                this.showDeleteDialog.set(false)
                this.isLoadingDelete.set(false)
            }
        );

    }
    constructor(
        public loginSvc : LoginService,
        private assignmentSvc : AssignmentService
    ) {}

}
