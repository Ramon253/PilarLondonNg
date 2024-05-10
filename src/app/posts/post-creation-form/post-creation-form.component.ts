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

@Component({
    selector: 'app-post-creation-form',
    standalone: true,
    imports: [YoutubeVideoComponent, ReactiveFormsModule, ValidationErrorComponent],
    templateUrl: './post-creation-form.component.html',
    styles: ``,
})
export class PostCreationFormComponent {
    @Output() post = new EventEmitter<Post>();
    @Output() close = new EventEmitter<boolean>();

    groups = input<{ name: string, id: string }[]>([])

    openLinks = viewChild<ElementRef>('openLink')
    closeLinks = viewChild<ElementRef>('closeLink')
    formLink = viewChild<ElementRef>('formLink')
    linkMenu = viewChild<ElementRef>('linkMenu')
    submitButton = viewChild<ElementRef>('submitButton')
    form = viewChild<ElementRef>('form')

    showError = signal<boolean>(false)

    links = signal<Link[]>([]);
    videos = signal<Link[]>([]);
    files = signal<File[]>([]);

    postForm = this.formBulider.group({
        name: ['', Validators.required],
        description: ['', Validators.maxLength(500)],
        group_id: ['', Validators.required]
    })

    linkForm = this.formBulider.group({
        link_name: ['', Validators.required],
        link: ['', Validators.required]
    })

    createLink() {
        const link = {
            link_name: this.linkForm.get('link_name')?.value,
            link: this.linkForm.get('link')?.value
        } as Link;


        this.links().push(link)

        this.addLink()
        this.linkForm.get('link_name')?.setValue('')
        this.linkForm.get('link')?.setValue('')

    }

    addLink() {
        this.openLinks()?.nativeElement.classList.toggle('hidden')
        this.closeLinks()?.nativeElement.classList.toggle('hidden')

        this.linkMenu()?.nativeElement.classList.toggle('-translate-x-[50%]')
        this.formLink()?.nativeElement.classList.toggle('h-10')
        this.formLink()?.nativeElement.classList.toggle('h-fit')

        this.submitButton()?.nativeElement.scrollIntoView({ block: "end", behavior: "smooth" });
    }

    addFile(event: any) {
        if (event.target.files.item(0) !== null) {
            this.files().push(event.target.files.item(0))
        }
    }

    deleteLink(link: Link) {
        this.links().splice(this.links().indexOf(link), 1)
    }
    deleteFile(file: File) {
        this.files().splice(this.files().indexOf(file), 1)
    }

    creteFile(file: HTMLInputElement) {

        let inputFile = file.files?.item(0) ?? null
        if (inputFile !== null)
            this.files().push(inputFile)
    }

    createPost(
        event: SubmitEvent,
        description: HTMLTextAreaElement
    ) {
        event.preventDefault();

        let formData = undefined
        const post = this.postForm.getRawValue() as Post
        post.description = description.value.replaceAll(' ', '') !== '' ? description.value : undefined

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


        this.postSvc.postPost(post, formData)
            .subscribe(
                res => {
                    post.links = this.links()
                    this.post.emit(post as Post);
                    this.toggleForm()
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

    download(file: File) {
        return URL.createObjectURL(file)
    }

    constructor(
        private renderer: Renderer2,
        public postSvc: PostService,
        private formBulider: FormBuilder
    ) {
    }

    protected readonly createFind = createFind;
}
