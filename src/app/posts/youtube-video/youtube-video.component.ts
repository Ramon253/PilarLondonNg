import {Component, ElementRef, input, output, Renderer2, signal, ViewChild} from '@angular/core';
import {LoginService} from '../../login.service';
import {LoadingWheelComponent} from '../../svg/loading-wheel/loading-wheel.component';
import {LinkService} from '../../services/resources/link.service';
import {Link} from '../../models/properties/link';

@Component({
    selector: 'app-youtube-video',
    standalone: true,
    imports: [LoadingWheelComponent],
    templateUrl: './youtube-video.component.html',
    styleUrl: './youtube-video.component.css'
})
export class YoutubeVideoComponent {
    showControls = input<boolean>(false)
    @ViewChild('container') container!: ElementRef
    parent = input.required<string>()
        link = input({id: '', link: '', link_name: ''}, {

            transform: (link: Link | undefined) => {

                if (!link) {
                    return {id: '', link: '', link_name: ''}
                }
                if (link.link.includes('youtube.com/embed')) return link;

                if (link.link.includes('drive.google.com')) {
                    link.link = link.link.replace('view', 'preview')
                    return link
                }

                link.link = link.link.replace('youtube.com', 'youtube.com/embed')
                link.link = link.link.replace('youtu.be', 'youtube.com/embed')

                return link
            }
        })

    delete = output<{ id: string, isVideo: boolean }>()
    isLoadingDelete = signal<boolean>(false)

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        public loginSvc: LoginService,
        private linkSvc: LinkService
    ) {
    }

    ngAfterViewInit() {
        this.addVideo()
    }

    deleteLink() {
        this.linkSvc.destroyLink(this.parent(), this)
    }

    addVideo() {
        let container = this.container.nativeElement
        const iframe = this.renderer.createElement('iframe');
        this.renderer.setAttribute(iframe, 'src', this.link()?.link ?? '')
        this.renderer.setAttribute(iframe, 'title', this.link()?.link_name ?? '')
        this.renderer.setAttribute(iframe, 'frameholder', "0")
        this.renderer.setAttribute(iframe, 'allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
        this.renderer.setAttribute(iframe, 'referrerpolicy', "strict-origin-when-cross-origin")
        this.renderer.setAttribute(iframe, "allowfullscreen", "")
        this.renderer.addClass(iframe, 'aspect-video')
        this.renderer.addClass(iframe, 'size-full')
        this.renderer.appendChild(container, iframe)
    }

}
