import {Component, ElementRef, EventEmitter, input, Output, Renderer2, signal, viewChild,} from '@angular/core';
import {Link} from '../../models/properties/link';
import {Post} from '../../models/post';
import {YoutubeVideoComponent} from '../youtube-video/youtube-video.component';
import {PostService} from '../../services/post.service';
import {Event} from "@angular/router";
import {createFind} from "rxjs/internal/operators/find";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-post-creation-form',
    standalone: true,
    imports: [YoutubeVideoComponent, ReactiveFormsModule],
    templateUrl: './post-creation-form.component.html',
    styles: ``,
})
export class PostCreationFormComponent {
    @Output() post = new EventEmitter<Post>();
    @Output() close = new EventEmitter<boolean>();

    groups = input<{name : string, id : string}[]>([])

    openLinks = viewChild<ElementRef>('openLink')
    closeLinks = viewChild<ElementRef>('closeLink')
    formLink = viewChild<ElementRef>('formLink')
    linkMenu = viewChild<ElementRef>('linkMenu')
    submitButton = viewChild<ElementRef>('submitButton')

    links = signal<Link[]>([]);
    videos = signal<Link[]>([]);
    files = signal<File[]>([]);

    postForm = this.formBulider.group({
        name : ['', Validators.required],
        description : ['', Validators.maxLength(500)],
        group_id : [Validators.required]
    })

    linkForm = this.formBulider.group({
        link_name : ['', Validators.required],
        link : ['', Validators.required]
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

    addLink(){
        this.openLinks()?.nativeElement.classList.toggle('hidden')
        this.closeLinks()?.nativeElement.classList.toggle('hidden')

        this.linkMenu()?.nativeElement.classList.toggle('-translate-x-[50%]')
        this.formLink()?.nativeElement.classList.toggle('h-10')
        this.formLink()?.nativeElement.classList.toggle('h-fit')

        this.submitButton()?.nativeElement.scrollIntoView({ block: "end", behavior: "smooth" });
    }

    deleteLink() {

    }

    creteFile(file: HTMLInputElement) {

        let inputFile = file.files?.item(0) ?? null
        if (inputFile !== null)
            this.files().push(inputFile)
    }

    createPost(
        titleInput: HTMLInputElement,
        descriptionInput: HTMLTextAreaElement,
        event: SubmitEvent
    ) {
        event.preventDefault();

        let post = {
            name: titleInput.value,
            subject: 'hOLA MUNDO',
            description: descriptionInput.value,
            links: this.links(),
            videos: this.videos(),
            files : this.files()
        };


        post.links.push(...this.videos())

        this.postSvc.postPost(post as Post)
            .subscribe(
                res => {
                    post.links = this.links()
                    this.post.emit(post as Post);
                }
            )

        this.links.set([]);
        this.videos.set([]);
        titleInput.value = '';
        descriptionInput.value = '';
    }

    checkLink(url: string): boolean {
        return url.includes('youtube') || url.includes('yout');
    }

    toggleForm() {
        this.close.emit(true);
    }

    constructor(
        private renderer: Renderer2,
        public postSvc: PostService,
        private formBulider : FormBuilder
    ) {
    }

    protected readonly createFind = createFind;
}
