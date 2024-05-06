import {Component, Input, output, signal} from '@angular/core';
import {YoutubeVideoComponent} from '../youtube-video/youtube-video.component';
import {Post} from '../../models/post';
import {MultimediaComponent} from '../../multimedia/multimedia.component';
import {LoginService} from '../../login.service';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {PostService} from "../../services/post.service";

@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [YoutubeVideoComponent, MultimediaComponent, RouterLink],
    templateUrl: './post-card.component.html',
    styles: ``,
})
export class PostCardComponent {
    @Input({required: true}) post!: Post;
    public isLoading = signal<boolean>(false)
    delete = output<Post>()
    public Post = signal<Post>({name: '', description: '', group_id: '', subject: ''} as Post)

    deletePost() {
        this.delete.emit(this.post as Post);
    }

    constructor(
        public loginSvc: LoginService,
        private route: ActivatedRoute,
        private postSvc: PostService
    ) {
    }


}
