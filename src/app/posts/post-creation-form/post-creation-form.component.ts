import {
    Component,
    EventEmitter,
    Output,
    Renderer2,
    signal,
} from '@angular/core';

import { fromEvent } from 'rxjs';
import { Link } from '../../models/link';
import { Post } from '../../models/post';
import { Title } from '@angular/platform-browser';
import { YoutubeVideoComponent } from '../youtube-video/youtube-video.component';

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
            text: textInput.value,
            url: urlInput.value,
        };

        if (this.checkLink(urlInput.value)) {
            this.videos().push(link);
        } else this.links().push(link);

        urlInput.value = '';
        textInput.value = '';
    }
    deleteLink(event : Event){
        console.log(event.target);
        
    }
    createPost(
        titleInput: HTMLInputElement,
        descriptionInput: HTMLTextAreaElement,
        event: SubmitEvent
    ) {
        event.preventDefault();
        let post = {
            title: titleInput.value,
            description: descriptionInput.value,
            links: this.links(),
            videos: this.videos(),
        };

        this.post.emit(post);

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

    constructor(private renderer: Renderer2) {}
}
