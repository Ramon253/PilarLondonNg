import { ApplicationRef, Component, ElementRef, EnvironmentInjector, NgZone, Renderer2, ViewChild, signal, viewChild, } from '@angular/core';
import { Post } from '../models/post';

import { PostCreationFormComponent } from './post-creation-form/post-creation-form.component';
import { PostCardComponent } from './post-card/post-card.component';
import { LoginService } from '../login.service';
import { PostService } from '../services/post.service';
import { Link } from "../models/properties/link";
import { Route, Router, RouterLink } from '@angular/router';
import { FileR } from '../models/properties/file';
import { throwError } from 'rxjs';
import { ValidationsService } from "../services/validations.service";


@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [PostCreationFormComponent, PostCardComponent, RouterLink],
    templateUrl: './posts.component.html',
    styles: ``,
})
export class PostsComponent {

    postContainer = viewChild<ElementRef>('postsContainer')
    isLoading = signal<boolean>(true)
    groups = signal<{ name: string, id: string }[]>([])
    posts = signal<Post[]>([]);
    files = signal<FileR[]>([])

    showPublic = signal<boolean>(false)

    constructor(
        private injector: EnvironmentInjector,
        private appRef: ApplicationRef,
        private renderer: Renderer2,
        private el: ElementRef,
        private router: Router,
        public loginSvc: LoginService,
        public postSvc: PostService,
        private validator: ValidationsService
    ) {
        this.getPosts(this.showPublic())
    }

    createPost(post: Post) {
        this.posts().push(post);
    }

    getPosts(showPublic: boolean) {
        this.showPublic.set(showPublic)
        this.isLoading.set(true)

        this.postSvc.getPosts(this.showPublic()).subscribe(
            (res) => {
                this.groups.set(res.groups as { name: string, id: string }[])
                this.posts.set(res.posts.map((post  :Post )=> {
                    post = this.postSvc.mapPost(post);
                    post.group_name = this.groups().find((group) => group.id === post.group_id)?.name
                    return post
                }))
                this.isLoading.set(false)
            },
            err => {
                if (this.Unauthenticated(err.status)) return

                if (err.status >= 500) {
                    throw new Error('Server error')
                }

            })
    }

    closeForm(form: HTMLDivElement) {
        form.classList.toggle('hidden');
    }

    openForm(form: HTMLDivElement) {
        form.classList.toggle('hidden');
    }


    deletePost(post: Post) {
        this.posts().splice(this.posts().indexOf(post), 1)
    }

    Unauthenticated(status: number): boolean {
        if (status === 401) {
            this.loginSvc.isLogged.set(false)
            localStorage.removeItem('isLogged')
            this.router.navigate(['/login'])
            return false
        }
        return true
    }

    filter(){
        alert('en proceso')
    }

}
