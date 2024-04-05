import { Component, Input } from '@angular/core';
import { YoutubeVideoComponent } from '../youtube-video/youtube-video.component';
import { Post } from '../../models/post';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [YoutubeVideoComponent],
    templateUrl: './post.component.html',
    styles: ``,
})
export class PostComponent {
    @Input({ required: true }) post!: Post;
}
