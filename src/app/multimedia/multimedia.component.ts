import {Component, input, output, signal} from '@angular/core';
import {FileR} from '../models/properties/file';
import {LoginService} from '../login.service';
import {LoadingWheelComponent} from '../svg/loading-wheel/loading-wheel.component';
import {FileService} from '../services/resources/file.service';
import {environment} from "../../environments/environment.development";

@Component({
    selector: 'app-multimedia',
    standalone: true,
    imports: [LoadingWheelComponent],
    templateUrl: './multimedia.component.html',
    styleUrl: './multimedia.component.css'
})
export class MultimediaComponent {
    file = input<FileR>()
    delete = output<{ id: string, isMultimedia: boolean }>()
    isLoadingDelete = signal<boolean>(false)
    parent = input.required<string>()
    showControls = input<boolean>(false)
    constructor(
        public loginSvc: LoginService,
        private fileSvc: FileService
    ) {
    }

    deleteFile() {
        this.fileSvc.destroyFile(this.parent(), this)
    }

    protected readonly environment = environment;
}
