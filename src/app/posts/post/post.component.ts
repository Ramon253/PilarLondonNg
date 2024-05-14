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
import { CommentService } from '../../services/resources/comment.service';
import { LoadingWheelComponent } from '../../svg/loading-wheel/loading-wheel.component';
import { DialogComponent } from '../../dialog/dialog.component';
import { FormPostComponent } from '../../resources/form-post/form-post.component';
import { LinkService } from '../../services/resources/link.service';
import { FileService } from '../../services/resources/file.service';
import { FileComponent } from '../../resources/file/file.component';
import { LinkComponent } from '../../resources/link/link.component';


@Component({
    selector: 'app-post',
    standalone: true,
    imports: [
        RouterLink, YoutubeVideoComponent, MultimediaComponent, ReactiveFormsModule, CommentComponent, LoadingWheelComponent, DialogComponent, FormPostComponent,
        FileComponent, LinkComponent
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})
export class PostComponent {
    privateComments = signal<boolean>(false)
    answerComment = signal<string | undefined>(undefined)
    inputLinks = signal<Link[]>([])
    inputFiles = signal<File[]>([])

    showPostDialog = signal<boolean>(false)
    showDeleteDialog = signal<boolean>(false)

    answerTo = signal<string | undefined>('')

    isLoadingPost = signal<boolean>(false)
    isLoading = signal<boolean>(true)
    isLoadingDelete = signal<boolean>(false)
    isLoadingPostResource = signal<boolean>(false)
    isLoadingFile = false
    isLoadingLink = false
    groups = signal<{ name: string, id: string }[]>([])

    groupInput = viewChild<ElementRef>('group_select')
    nameInput = viewChild<ElementRef>('nameInput')
    descriptionInput = viewChild<ElementRef>('descriptionInput')
    commentInput = viewChild<ElementRef>('commentInput')

    prevLink = ''

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
                    (post : any) => {
                        this.post.set(this.postSvc.mapPost(post))
                        this.isLoading.set(false)
                    },  
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
        public validator: ValidationsService,
        private commentSvc: CommentService,
        private linkSvc: LinkService,
        private fileSvc: FileService
    ) {

    }



    postResource() {
        this.isLoadingPostResource.set(true)

        if (this.inputFiles().length !== 0) {
            this.fileSvc.createFiles('post', this)
        }
        if (this.inputLinks().length !== 0) {
           this.linkSvc.createLinks('post', this)
        }
    }

    postComment() {
        this.commentSvc.createComment('post', this)
    }

    /*
    * Updates
    */

    updatePost() {
        this.post().subject = 'dd'

        if (this.update().name) {
            this.post().name = this.nameInput()?.nativeElement.value
        }
        if (this.update().group_id) {
            this.post().group_id = this.groupInput()?.nativeElement.value
            this.post().group_name = this.groups().find((group) => this.post().group_id == group.id)?.name
        }
        if (this.update().description) {
            this.post().description = this.descriptionInput()?.nativeElement.value
        }
        this.postSvc.putPost(this.post()).subscribe(
            post => {
            },
            err => {
                this.postSvc.getPosts().subscribe(
                    post => this.post.set(this.postSvc.mapPost(post))
                )
            }
        )
        this.restartUpdate()
    }

    deletePost() {
        this.isLoadingDelete.set(true)
        this.postSvc.deletePost(this.post()).subscribe(
            res => {
                this.router.navigate(['/posts'])
            }
        )
    }

    deleteComment(id: string) {
        this.post().comments = this.post().comments?.filter(comment => comment.id !== id)
    }

    deleteFile(id: string, isMultimedia: boolean) {
        if (isMultimedia) {
            this.post().multimedia = this.post().multimedia?.filter(mult => id !== mult.id.toString())
        } else
            this.post().fileLinks = this.post().fileLinks?.filter(file => id !== file.id.toString())

    }

    deleteLink(id: string, isIframe: boolean) {
        if (isIframe) {
            this.post().videos = this.post().videos?.filter(video => id !== video.id)
        } else {
            this.post().links = this.post().links?.filter(link => id !== link.id)
        }
    }

    answer(comment_id: string | undefined) {
        this.answerComment.set(comment_id)
    }

    private restartUpdate() {
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

    hasResources(){
        return this.post().fileLinks?.length !== 0 || this.post().links?.length !== 0 || this.loginSvc.user()?.role === 'teacher'
    }

    protected readonly popResultSelector = popResultSelector;
}
