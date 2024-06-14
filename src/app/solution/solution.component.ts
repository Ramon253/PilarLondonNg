import {Component, input, output, signal} from '@angular/core';
import {Solution} from "../models/solution";
import {FileComponent} from "../resources/file/file.component";
import {LinkComponent} from "../resources/link/link.component";
import {SolutionService} from "../services/solution.service";
import {FileService} from "../services/resources/file.service";
import {LinkService} from "../services/resources/link.service";
import {YoutubeVideoComponent} from "../posts/youtube-video/youtube-video.component";
import {MultimediaComponent} from "../multimedia/multimedia.component";

@Component({
    selector: 'app-solution',
    standalone: true,
    imports: [FileComponent, LinkComponent, YoutubeVideoComponent, MultimediaComponent],
    templateUrl: './solution.component.html',
    styles: ``
})
export class SolutionComponent {
    isLoading = signal<boolean>(true)
    solutionId = input.required<string>()
    solution = signal<Solution>({updated_at: new Date()})
    close = output<boolean>()
    editNote = signal<boolean>(false)

    constructor(
        private solutionSvc: SolutionService,
        private fileSvc: FileService,
        private linkSvc: LinkService
    ) {
        addEventListener('keydown', (ev) => {

            if (ev.key === 'Escape') {
                this.close.emit(true)
            }
        })
    }

    grade(ev: SubmitEvent, grade: HTMLInputElement) {
        ev.preventDefault()
        let note: number = parseFloat(grade.value)
        this.solutionSvc.grade(this.solution().id ?? '', note).then(
            res => {
                this.close.emit(true)
            }
        )
    }

    ngOnInit() {
        this.solutionSvc.getSolution(this.solutionId()).subscribe(
            res => {
                let links = this.linkSvc.mapLinks(res.links ?? [])

                res.links = links.links
                res.videos = links.videos

                let files = this.fileSvc.mapFiles(res.fileLinks ?? [])

                res.fileLinks = files.files
                res.multimedia = files.multimedia

                this.solution.set(res)
                this.isLoading.set(false)
            },
            error => {
                this.isLoading.set(false)
            }
        )
    }


    hasResource(rs: string) {
        switch (rs) {
            case 'video' :
                return this.solution().videos?.length !== 0
            case 'multimedia' :
                return this.solution().multimedia?.length !== 0
            case 'links' :
                return this.solution().links?.length !== 0
            case 'files' :
                return this.solution().fileLinks?.length !== 0
        }
        return false
    }
}
