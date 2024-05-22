import { Component, ElementRef, EventEmitter, input, Output, Renderer2, signal, viewChild, } from '@angular/core';
import { Link } from '../../models/properties/link';
import { Post } from '../../models/post';
import { YoutubeVideoComponent } from '../youtube-video/youtube-video.component';
import { PostService } from '../../services/post.service';
import { Event } from "@angular/router";
import { createFind } from "rxjs/internal/operators/find";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ValidationErrorComponent } from '../../validations/validation-error/validation-error.component';
import { Title } from '@angular/platform-browser';
import { FormPostComponent } from '../../resources/form-post/form-post.component';
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {LoginService} from "../../login.service";

@Component({
    selector: 'app-post-creation-form',
    standalone: true,
    imports: [YoutubeVideoComponent, ReactiveFormsModule, ValidationErrorComponent, FormPostComponent, LoadingWheelComponent],
    templateUrl: './post-creation-form.component.html',
    styles: ``,
})
export class PostCreationFormComponent {
    @Output() post = new EventEmitter<Post>();
    @Output() close = new EventEmitter<boolean>();

    groups = input<{ name: string, id: string }[]>([])
    isLoading = signal<boolean>(false)
    submitButton = viewChild<ElementRef>('submitButton')
    form = viewChild<ElementRef>('form')
    showError = signal<boolean>(false)

    links = signal<Link[]>([]);
    videos = signal<Link[]>([]);
    files = signal<File[]>([]);

    postForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.maxLength(500)],
        group_id: ['', Validators.required]
    })


    creteFile(file: HTMLInputElement) {

        let inputFile = file.files?.item(0) ?? null
        if (inputFile !== null)
            this.files().push(inputFile)
    }

    async createPost(
        event: SubmitEvent,
        description: HTMLTextAreaElement
    ) {
        event.preventDefault();

        this.isLoading.set(true)
        let formData = undefined
        const post = this.postForm.getRawValue() as Post
        post.description = description.value
        description.value = ''

        post.links = (this.links().length !== 0) ? this.links() : undefined;
        post.files = (this.files().length !== 0) ? this.files() : undefined;

        if (post.files) {
            formData = new FormData
            for (const key in post.files) {
                formData.append(`files[${key}]`, post.files[key])
            }
            formData.append('name', post.name)

            if (post.description)
                formData.append('description', post.description)
            if (post.links) {
                for (const key in post.links) {
                    formData.append(`links[${key}][link_name]`, post.links[key].link_name)
                    formData.append(`links[${key}][link]`, post.links[key].link)
                }
            }
        }
        await this.loginSvc.getCsrf()
        this.postSvc.postPost(post, formData , this.postForm.get('group_id')?.value === 'public')
            .subscribe(
                (res : any ) => {
                    post.links = this.links()
                    this.post.emit(res.post as Post);
                    this.toggleForm()
                    this.isLoading.set(false)

                    this.postForm.reset()
                }
            )

        this.links.set([]);
        this.files.set([]);
    }

    checkLink(url: string): boolean {
        return url.includes('youtube') || url.includes('yout');
    }

    toggleForm() {
        this.close.emit(true);
    }

    tryPostPost() {
        if (this.postForm.get('group_id')?.invalid)
            this.showError.set(true)
    }


    constructor(
        private renderer: Renderer2,
        public postSvc: PostService,
        private formBuilder: FormBuilder,
        public loginSvc : LoginService
    ) {
    }

    protected readonly createFind = createFind;
}
