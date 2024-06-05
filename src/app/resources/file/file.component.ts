import {Component, input, output, signal} from '@angular/core';
import {FileR} from '../../models/properties/file';
import {LoginService} from '../../login.service';
import {LoadingWheelComponent} from '../../svg/loading-wheel/loading-wheel.component';
import {FileService} from '../../services/resources/file.service';
import {environment} from "../../../environments/environment.development";


@Component({
    selector: 'app-file',
    standalone: true,
    imports: [LoadingWheelComponent],
    templateUrl: './file.component.html',
    styleUrl: './file.component.css'
})
export class FileComponent {
    file = input<FileR>()
    color = input<string>('secondary')
    showControls = input<boolean>(false)
    hoverCloseButton = signal<boolean>(false)
    delete = output<{ id: string, isMultimedia: boolean }>()

    parent = input.required<string>()
    isLoadingDelete = signal<boolean>(false)

    constructor(
        public loginSvc: LoginService,
        public fileSvc: FileService
    ) {
    }

    download() {
        this.fileSvc.downLoadFile(environment.baseUrl + `api/${this.parent()}/file/${this.file()?.id}/download`).subscribe(
            (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const newTab = window.open();
                if (newTab !== null)
                    newTab.location.href = url;
            },
            error => console.error('Download failed', error)
        );
    }

    deleteFile() {
        this.fileSvc.destroyFile(this.parent(), this)
    }

    disableLink(event: Event) {
        if (this.hoverCloseButton())
            event.preventDefault()
    }

    protected readonly environment = environment;
}
