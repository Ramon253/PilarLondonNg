import { Component, ElementRef, effect, signal, viewChild } from '@angular/core';
import { PostService } from "../../services/post.service";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Post } from "../../models/post";
import { DatePipe } from "@angular/common";
import { popResultSelector } from "rxjs/internal/util/args";
import { LoginService } from "../../login.service";
import { ValidationsService } from "../../services/validations.service";
import { YoutubeVideoComponent } from "../youtube-video/youtube-video.component";
import { MultimediaComponent } from "../../multimedia/multimedia.component";
import { Comment } from "../../models/properties/comment";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommaExpr } from '@angular/compiler';
import { CommentComponent } from '../../resources/comment/comment.component';
import { FileR } from '../../models/properties/file';
import { Link } from '../../models/properties/link';


@Component({
    selector: 'app-post',
    standalone: true,
    imports: [
        RouterLink, YoutubeVideoComponent, MultimediaComponent, ReactiveFormsModule, CommentComponent
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})
export class PostComponent {
    privateComments = signal<boolean>(false)
    answerComment = signal<string | undefined>(undefined)

    comments = signal<Comment[]>([])
    answerTo = signal<string | undefined>('')

    isLoadingPost = signal<boolean>(false)
    isLoading = signal<boolean>(true)
    groups = signal<{ name: string, id: string }[]>([])

    groupInput = viewChild<ElementRef>('group_select')
    nameInput = viewChild<ElementRef>('nameInput')
    descriptionInput = viewChild<ElementRef>('descriptionInput')


    updateAny = signal<boolean>(false);
    update = signal<any>({
        name: false,
        subject: false,
        description: false,
        group_id: false,
        files: false,
        links: false
    })

    post = signal<Post>({
        name: '',
        description: '',
        group_id: ''
    } as Post)

    id = ''
    postForm = new FormGroup({
        Comentario: new FormControl('', Validators.required)
    })

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.id = params['post']
                this.postSvc.getPost(this.id).subscribe(
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
        public loginSvc: LoginService,
        public validator: ValidationsService
    ) {

    }

    getPost = (post: any) => {

        post.fileLinks = post.files
        this.groups.set(post.groups as { name: string, id: string }[])

        post = post as Post

        post.created_at = this.datePipe.transform(post.created_at, 'HH:mm dd/MM/yyyy') ?? ''
        post.multimedia = []
        post.videos = []


        post.fileLinks = post.fileLinks.filter((fileLink: FileR) => {
            if (!this.validator.checkFile(fileLink.mime_type)) {
                return true
            }
            post.multimedia?.push(fileLink)
            return false
        })

        post.links = post.links.filter((link: Link) => {
            if (!this.validator.checkLink(link.link)) {
                return true
            }
            post.videos.push(link)
            return false
        })

        post.comments = post.comments?.map((comment: Comment) => {
            comment.created_at = this.datePipe.transform(comment.created_at, 'HH:mm dd/MM/yyyy') ?? ''
            return comment
        })
        this.comments.set(post.comments as Comment[])

        this.isLoading.set(false);
        this.post.set(post as Post)
    }


    postComment() {
        this.isLoadingPost.set(true)
        let content = this.postForm.get('Comentario')?.value

        const comment = {
            content: content,
            public: !this.privateComments(),
            post_id: this.post().id,
            parent_id: this.answerComment(),
        } as Comment

        this.postSvc.postComment(comment as Comment).subscribe(
            res => {
                if (!this.post().comments) this.post().comments = []
                this.isLoadingPost.set(false)
                this.postForm.get('Comentario')?.setValue('')
                this.postSvc.getPost(this.id).subscribe(this.getPost)
                this.answerComment.set(undefined)
                this.answerTo.set(undefined)
            },
            error => {
                this.postForm.get('Comentario')?.setErrors({ required: true })
                this.isLoadingPost.set(false)
            }
        )
    }

    /*
    * Updates
    */

    updatePost(){
        this.post().subject = 'dd'
        if (this.update().name){
            this.post().name = this.nameInput()?.nativeElement.value
        }
        if (this.update().group_id){
            this.post().group_id = this.groupInput()?.nativeElement.value
            this.post().group_name = this.groups().find((group) =>  this.post().group_id == group.id)?.name
        }
        if (this.update().description){
            this.post().description = this.descriptionInput()?.nativeElement.value
        }
        this.postSvc.putPost(this.post()).subscribe(
            post => {
            },
            err =>{
                this.postSvc.getPosts().subscribe(
                    this.getPost
                )
            }
        )
        this.restartUpdate()
    }
    answer(comment_id: string | undefined) {
        this.answerComment.set(comment_id)

    }
    private restartUpdate(){
        this.update.set({
            name: false,
            subject: false,
            description: false,
            group_id: false,
            files: false,
            links: false
        })
        this.updateAny.set(false)
    }

    triggerResize(textArea: HTMLTextAreaElement) {
        while (textArea.scrollHeight > textArea.clientHeight) {
            textArea.rows += 1
        }
    }
    protected readonly popResultSelector = popResultSelector;
}
