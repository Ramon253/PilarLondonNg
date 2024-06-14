import {Component, ElementRef, signal, viewChild} from '@angular/core';
import {PostService} from "../../services/post.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Post} from "../../models/post";
import {popResultSelector} from "rxjs/internal/util/args";
import {LoginService} from "../../login.service";
import {ValidationsService} from "../../services/validations.service";
import {YoutubeVideoComponent} from "../youtube-video/youtube-video.component";
import {MultimediaComponent} from "../../multimedia/multimedia.component";
import {Comment} from "../../models/properties/comment";
import {ReactiveFormsModule} from "@angular/forms";
import {CommentComponent} from '../../resources/comment/comment.component';
import {Link} from '../../models/properties/link';
import {CommentService} from '../../services/resources/comment.service';
import {LoadingWheelComponent} from '../../svg/loading-wheel/loading-wheel.component';
import {DialogComponent} from '../../dialog/dialog.component';
import {FormPostComponent} from '../../resources/form-post/form-post.component';
import {LinkService} from '../../services/resources/link.service';
import {FileService} from '../../services/resources/file.service';
import {FileComponent} from '../../resources/file/file.component';
import {LinkComponent} from '../../resources/link/link.component';
import {CommentsComponent} from '../../resources/comments/comments.component';
import {FlashMessageService} from "../../services/flash-message.service";


@Component({
    selector: 'app-post',
    standalone: true,
    imports: [
        RouterLink, YoutubeVideoComponent, MultimediaComponent, ReactiveFormsModule, CommentComponent, LoadingWheelComponent, DialogComponent, FormPostComponent,
        FileComponent, LinkComponent, CommentsComponent
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})
export class PostComponent {

    inputLinks = signal<Link[]>([])
    inputFiles = signal<File[]>([])

    showPostDialog = signal<boolean>(false)
    showDeleteDialog = signal<boolean>(false)

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

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.id = params['post']
                this.postSvc.getPost(this.id).subscribe(
                    (post: any) => {

                        this.post.set(this.postSvc.mapPost(post))

                        this.isLoading.set(false)
                    },
                    error => {

                        if (error.status === 401) {
                            let message = {
                                message: '',
                                type: 'error',
                                duration: 10
                            }
                            if (error.error.code === 2) {
                                this.router.navigate(['/posts'])
                                message.message = 'Necesitas ser estudiante para acceder a este post'
                                this.flashMessageService.messages().push(message)
                                return
                            }
                            if (error.error.code === 3) {
                                this.router.navigate(['/posts'])
                                message.message = 'Necesitas ser parte del mismo grupo para acceder a este post'
                                this.flashMessageService.messages().push(message)
                                return
                            }
                            this.loginSvc.logoutFront();
                            this.router.navigate(['/login'])
                        }
                    }
                )
            }
        )
    }

    constructor(
        private postSvc: PostService,
        private route: ActivatedRoute,
        private router: Router,
        public loginSvc: LoginService,
        public validator: ValidationsService,
        private linkSvc: LinkService,
        private fileSvc: FileService,
        public commentSvc: CommentService,
        private flashMessageService: FlashMessageService
    ) {

    }


    postResource() {
        this.isLoadingPostResource.set(true)

        if (this.inputFiles().length !== 0) {
            this.fileSvc.createFiles('post', this, this.post())
        }
        if (this.inputLinks().length !== 0) {
            this.linkSvc.createLinks('post', this, this.post())
        }
    }


    /*
    * Updates
    */

    updatePost() {
        const post: Post = {id: this.post().id, name: this.post().name, group_id: '', subject: 'dd'}

        if (this.update().name) {
            post.name = this.nameInput()?.nativeElement.value
        }
        if (this.update().group_id) {
            post.group_id = this.groupInput()?.nativeElement.value
            post.group_name = this.groups().find((group) => this.post().group_id == group.id)?.name
        } else if (this.post().group_id === null) post.group_id = 'public'
        else
            post.group_id = this.post().group_id

        if (this.update().description) {
            post.description = (this.descriptionInput()?.nativeElement.value.replaceAll(' ', '') === '') ? '--@undefined' : this.descriptionInput()?.nativeElement.value
        }

        this.postSvc.putPost(post).then(
            res => {
                this.post.set(res.data.post)
                this.flashMessageService.messages().push({
                    message: 'Post updated successfully',
                    duration: 5,
                    type: 'message'
                })
            }
        ).catch(err => {
            this.postSvc.getPost(this.post().id?.toString() ?? '').subscribe(
                post => this.post.set(this.postSvc.mapPost(post))
            )
            this.flashMessageService.messages().push({
                message: 'Error while updating post',
                duration: 5,
                type: 'error'
            })
        })
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

    postComment(comments: Comment[]) {
        this.post().comments = comments
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

    hasResources() {
        return this.post().fileLinks?.length !== 0 || this.post().links?.length !== 0 || this.loginSvc.user()?.role === 'teacher'
    }

    protected readonly popResultSelector = popResultSelector;
}
