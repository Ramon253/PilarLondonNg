import { Component, EventEmitter, Input, input, output, signal } from '@angular/core';
import { YoutubeVideoComponent } from '../youtube-video/youtube-video.component';
import { Post } from '../../models/post';
import { MultimediaComponent } from '../../multimedia/multimedia.component';
import { LoginService } from '../../login.service';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [YoutubeVideoComponent, MultimediaComponent],
    templateUrl: './post.component.html',
    styles: ``,
})
export class PostComponent {
    @Input({ required: true }) post!: Post;
    public isLoading = signal<boolean>(false)
    delete = output<Post>()


    deletePost(){
        this.delete.emit(this.post as Post);
    }

    constructor(public loginSvc : LoginService){}
}
