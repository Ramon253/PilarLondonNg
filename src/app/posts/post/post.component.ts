import {Component, signal} from '@angular/core';
import {PostService} from "../../services/post.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Post} from "../../models/post";
import {DatePipe} from "@angular/common";
import {popResultSelector} from "rxjs/internal/util/args";
import {LoginService} from "../../login.service";
import {ValidationsService} from "../../services/validations.service";
import {YoutubeVideoComponent} from "../youtube-video/youtube-video.component";
import {MultimediaComponent} from "../../multimedia/multimedia.component";
import {Comment} from "../../models/properties/comment";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [
        RouterLink, YoutubeVideoComponent, MultimediaComponent, ReactiveFormsModule
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})
export class PostComponent {
    privateComments = signal<boolean>(false)
    post = signal<Post>({
        name: '',
        subject: '',
        description: '',
        group_id: ''
    } as Post)

    postForm = new FormGroup({
        Comentario : new FormControl('', Validators.required)
    })

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.postSvc.getPost(params['post']).subscribe(
                    this.getPost,
                    error => {
                        if (error.status === 401) {
                            this.router.navigate(['/login'])
                            this.loginSvc.isLogged.set(false)
                        }
                    }
                )
            }
        )
    }

    constructor(
        private postSvc: PostService,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private router: Router,
        private loginSvc: LoginService,
        public validator: ValidationsService) {
    }

    getPost = (post: Post) => {
        console.log(post)
        post.created_at = this.datePipe.transform(post.created_at, 'HH:mm dd/MM/yyyy') ?? ''
        post.multimedia = []
        post.videos = []

        post.files = post.files.filter((file) => {
            if (!this.validator.checkFile(file.mime_type)) {
                return true
            }
            post.multimedia?.push(file)
            return false
        })

        post.links = post.links.filter((link) => {
            if (!this.validator.checkLink(link.link)) {
                return true
            }
            post.videos.push(link)
            return false
        })

        this.post.set(post as Post)
    }


    postComment() {
        let content = this.postForm.get('Comentario')?.value


        const comment = {
            content: content,
            public: !this.privateComments(),
            post_id: this.post().id,
        }

        this.postSvc.postComment(comment as Comment).subscribe(
            res => {
                if (!this.post().comments) this.post().comments = []
                this.post().comments?.push(comment as Comment)
                this.postForm.get('Comentario')?.setValue('')
            },
            error => {
                this.postForm.get('Comentario')?.setErrors({required : true})
            }
        )
    }

    protected readonly popResultSelector = popResultSelector;
}
