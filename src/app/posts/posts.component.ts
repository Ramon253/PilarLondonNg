import { ApplicationRef, Component, ElementRef, EnvironmentInjector, Renderer2, signal, viewChild, } from '@angular/core';
import { Post } from '../models/post';

import { PostCreationFormComponent } from './post-creation-form/post-creation-form.component';
import { PostCardComponent } from './post-card/post-card.component';
import { LoginService } from '../login.service';
import { PostService } from '../services/post.service';
import { Link } from "../models/properties/link";
import {Route, Router, RouterLink} from '@angular/router';
import { FileR } from '../models/properties/file';
import { throwError } from 'rxjs';


@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [PostCreationFormComponent, PostCardComponent, RouterLink],
    templateUrl: './posts.component.html',
    styles: ``,
})
export class PostsComponent {

    postContainer = viewChild<ElementRef>('postsContainer')
    loading = viewChild<ElementRef>('loadingContainer')

    posts = signal<Post[]>([]);
    files = signal<FileR[]>([])

    constructor(
        private injector: EnvironmentInjector,
        private appRef: ApplicationRef,
        private renderer: Renderer2,
        private el: ElementRef,
        private router: Router,
        public loginSvc: LoginService,
        public postSvc: PostService
    ) {

        if(!this.loginSvc.isLogged()){
            router.navigate(['/login'])
        }
        this.getPosts()
    }

    createPost(post: Post) {
        this.posts().push(post);
    }

    getPosts() {
        this.postSvc.getPosts().subscribe(res => {

            this.posts().push(...res.map(this.getResources) as Post[])

            this.loading()?.nativeElement.classList.add('hidden')
            this.postContainer()?.nativeElement.classList.remove('hidden')
            this.postContainer()?.nativeElement.classList.add('flex')
        },
        err => {
            if (this.Unauthenticated(err.status)) return

            if (err.status >= 500) {
                throw new Error('Server error')
            }

        })
    }

    getResources = (post: Post) => {
        /**
         * Get links
         */
        post.videos = []
        post.links = post.links.filter((link: Link) => {
            if (this.postSvc.checkLink(link.link)) {
                post.videos.push(link)
                return false
            }
            return true
        })

        /**
         * Get files
         */
        post.multimedia = []
        post.files = post.files.filter((file: FileR) => {
            if (file.mime_type.includes('image') || file.mime_type.includes('video')) {
                post.multimedia?.push(file)
                return false
            }
            return true
        })

        return post
    }

    closeForm(form: HTMLDivElement) {
        form.classList.toggle('hidden');
    }

    openForm(form: HTMLDivElement) {
        form.classList.toggle('hidden');
    }



    async deletePost(post : Post){

        await this.loginSvc.getCsrf()
        this.postSvc.deletePost(post).subscribe(res => {

            if (res.error){

                return
            }
            alert('sifufo')
            this.posts().splice(this.posts().indexOf(post), 1)
        })
    }

    Unauthenticated(status : number) : boolean{
        if (status === 401){
            this.loginSvc.isLogged.set(false)
            localStorage.removeItem('isLogged')
            this.router.navigate(['/login'])
            return false
        }
        return true
    }
}
