import {
    ApplicationRef,
    Component,
    ElementRef,
    EnvironmentInjector,
    Renderer2,
    signal,
    viewChild,
} from '@angular/core';
import { Post } from '../models/post';

import { PostCreationFormComponent } from './post-creation-form/post-creation-form.component';
import { PostComponent } from './post/post.component';
import { LoginService } from '../login.service';
import { PostService } from '../services/post.service';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [PostCreationFormComponent, PostComponent],
    templateUrl: './posts.component.html',
    styles: ``,
})
export class PostsComponent {

    postContainer = viewChild<ElementRef>('postsContainer')
    loading = viewChild<ElementRef>('loadingContainer')

    posts = signal<Post[]>([]);
    tytle = signal<string>('mi post');

    constructor(
        private injector: EnvironmentInjector,
        private appRef: ApplicationRef,
        private renderer: Renderer2,
        private el: ElementRef,
        public loginSvc: LoginService,
        public postSvc: PostService
    ) {
        this.postSvc.getPosts().subscribe(res => {

            this.posts().push(...res as Post[])

            this.loading()?.nativeElement.classList.add('hidden')
            this.postContainer()?.nativeElement.classList.remove('hidden')
            this.postContainer()?.nativeElement.classList.add('flex')
        }
        )
    }

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
