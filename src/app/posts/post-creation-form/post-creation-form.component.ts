import {Component, EventEmitter, Output, Renderer2, signal,} from '@angular/core';
import {Link} from '../../models/properties/link';
import {Post} from '../../models/post';
import {YoutubeVideoComponent} from '../youtube-video/youtube-video.component';
import {PostService} from '../../services/post.service';

@Component({
    selector: 'app-post-creation-form',
    standalone: true,
    imports: [YoutubeVideoComponent],
    templateUrl: './post-creation-form.component.html',
    styles: ``,
})
export class PostCreationFormComponent {
    @Output() post = new EventEmitter<Post>();
    @Output() close = new EventEmitter<boolean>();

    links = signal<Link[]>([]);
    videos = signal<Link[]>([]);

    createLink(urlInput: HTMLInputElement, textInput: HTMLInputElement) {
        const link = {
            link_name: textInput.value,
            link: urlInput.value,
            id: '1'
        };

        if (this.checkLink(urlInput.value)) {
            this.videos().push(link);
        } else this.links().push(link);

        urlInput.value = '';
        textInput.value = '';
    }

    deleteLink(event: Event) {
        console.log(event.target);
    }

    createPost(
        titleInput: HTMLInputElement,
        descriptionInput: HTMLTextAreaElement,
        event: SubmitEvent
    ) {
        event.preventDefault();

        let post = {
            name: titleInput.value,
            subject: 'hOLA MUNDO',
            description: descriptionInput.value,
            links: this.links(),
            videos: this.videos()
        };


        post.links.push(...this.videos())

        this.postSvc.postPost(post as Post)
            .subscribe(
                  res => {
                    post.links = this.links()
                    this.post.emit(post as Post);
                }
            )

        this.links.set([]);
        this.videos.set([]);
        titleInput.value = '';
        descriptionInput.value = '';
    }

    checkLink(url: string): boolean {
        return url.includes('youtube') || url.includes('yout');
    }

    toggleForm() {
        this.close.emit(true);
    }

    constructor(
        private renderer: Renderer2,
        public postSvc: PostService
    ) {
    }
}
