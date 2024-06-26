import {Component, input, signal} from '@angular/core';
import {Solution} from "../../models/solution";
import {FileComponent} from "../../resources/file/file.component";
import {LinkComponent} from '../../resources/link/link.component';
import {DatePipe} from '@angular/common';
import {DialogComponent} from "../../dialog/dialog.component";
import {Link} from "../../models/properties/link";
import {FormPostComponent} from "../../resources/form-post/form-post.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {FileService} from "../../services/resources/file.service";
import {LinkService} from "../../services/resources/link.service";

@Component({
    selector: 'app-your-solution',
    standalone: true,
    imports: [
        FileComponent,
        LinkComponent,
        DialogComponent,
        FormPostComponent,
        LoadingWheelComponent
    ],
    templateUrl: './your-solution.component.html',
    styles: ``
})
export class YourSolutionComponent {
    updateDescription = signal<boolean>(false)
    solution = input.required<Solution>()
    dead_line = input.required<Date | boolean>()
    showPostDialog = signal<boolean>(false)
    showNote = input<boolean>(true)


    isLoadingLink = false
    isLoadingFile = false
    isLoadingPostResource = signal<boolean>(false)
    inputLinks = signal<Link[]>([])
    inputFiles = signal<File[]>([])

    constructor(
        private datePipe: DatePipe,
        private fileSvc: FileService,
        private linkSvc: LinkService
    ) {
    }


    postResource() {
        this.isLoadingPostResource.set(true)

        if (this.inputFiles().length !== 0) {
            this.fileSvc.createFiles('solution', this, this.solution())
        }
        if (this.inputLinks().length !== 0) {
            this.linkSvc.createLinks('solution', this, this.solution())
            this.solution().links = this.solution().videos
        }
    }

    getDelay() {
        let hours = this.solution().onTime ?? 60
        hours = Math.floor(hours / 60)

        let minutes = this.solution().onTime ?? 60
        minutes = minutes % 60
        return ` ${hours} horas y ${minutes} minutos`
    }

    deleteFile(event: { id: string, isMultimedia: boolean }) {
        this.solution().fileLinks = this.solution().fileLinks?.filter(fileLink => fileLink.id.toString() !== event.id)
    }

    deleteLink(event: { id: string, isVideo: boolean }) {
        this.solution().links = this.solution().links?.filter(link => link.id !== event.id)
    }

    showDate(date: Date) {
        return this.datePipe.transform(date, 'HH:mm dd/MM/yyyy')
    }
}
