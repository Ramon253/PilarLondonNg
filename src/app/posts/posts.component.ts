import {
    ApplicationRef,
    Component,
    ElementRef,
    EnvironmentInjector,
    Renderer2,
    signal,
} from '@angular/core';
import { Post } from '../models/post';

import { PostCreationFormComponent } from './post-creation-form/post-creation-form.component';
import { PostComponent } from './post/post.component';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [PostCreationFormComponent, PostComponent],
    templateUrl: './posts.component.html',
    styles: ``,
})
export class PostsComponent {
    posts = signal<Post[]>([]);

    tytle = signal<string>('mi post');

    constructor(
        private injector: EnvironmentInjector,
        private appRef: ApplicationRef,
        private renderer: Renderer2,
        private el: ElementRef
    ) {}

    createPost(post: Post) {
        this.posts().push(post);
    }
    closeForm(form: HTMLDivElement) {
        form.classList.toggle('hidden');
    }
    openForm(form: HTMLDivElement) {
        form.classList.toggle('hidden');
    }
}
