import {Component, Input, output, signal} from '@angular/core';
import {YoutubeVideoComponent} from '../youtube-video/youtube-video.component';
import {Post} from '../../models/post';
import {MultimediaComponent} from '../../multimedia/multimedia.component';
import {LoginService} from '../../login.service';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {PostService} from "../../services/post.service";
import { LinkComponent } from '../../resources/link/link.component';
import { FileComponent } from '../../resources/file/file.component';
import { DialogComponent } from '../../dialog/dialog.component';
import { LoadingWheelComponent } from '../../svg/loading-wheel/loading-wheel.component';

@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [YoutubeVideoComponent, MultimediaComponent, RouterLink, LinkComponent, FileComponent, DialogComponent, LoadingWheelComponent],
    templateUrl: './post-card.component.html',
    styles: ``,
})
export class PostCardComponent {
    @Input({required: true}) post!: Post;
    showDeleteDialog = signal<boolean>(false)
    isLoadingDelete = signal<boolean>(false)

    delete = output<Post>()

    public Post = signal<Post>({name: '', description: '', group_id: '', subject: ''} as Post)

    deletePost() {
        this.isLoadingDelete.set(true)
        this.postSvc.deletePost(this.post).subscribe(
            res => {
                this.isLoadingDelete.set(false)
                this.showDeleteDialog.set(false)
                this.delete.emit(this.post)
            },
            err => {
                this.isLoadingDelete.set(false)
                this.showDeleteDialog.set(false)
            }
        )
    }

    constructor(
        public loginSvc: LoginService,
        private route: ActivatedRoute,
        private postSvc: PostService
    ) {
    }


}
