import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { Post } from '../models/post';
import { HttpClient } from '@angular/common/http';
import { Response } from '../models/response';
import { Comment } from "../models/properties/comment";
import { DatePipe } from '@angular/common';
import { FileR } from '../models/properties/file';
import { ValidationsService } from './validations.service';
import { Link } from '../models/properties/link';
import { FileService } from './resources/file.service';
import { LinkService } from './resources/link.service';
import { CommentService } from './resources/comment.service';


@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
        private validator: ValidationsService,
        private fileSvc: FileService,
        private linkSvc: LinkService,
        private commentSvc: CommentService
    ) { }

    private path = 'http://localhost:8000/api/'

    public getPosts(isPublic?: boolean): Observable<{ posts: Post[], groups?: [] }> {
        if (isPublic)
            return this.http.get<{ posts: Post[], groups?: [] }>(this.path + 'posts', { withCredentials: true })

        return this.http.get<{ posts: Post[], groups?: [] }>(`${this.path}dashboard/post`, { withCredentials: true })
    }

    public getPost(post_id: string): Observable<Post> {
        return this.http.get<Post>(this.path + 'post/' + post_id, { withCredentials: true })
    }

    public postPost(post: Post, formData: FormData | undefined, isPublic : boolean): Observable<Post> {
        
        const postPath = (isPublic)?this.path + 'post' : this.path + `group/${post.group_id}/post`

        if (formData) {
            return this.http.post<Post>(
                postPath,
                formData,
                {
                    withCredentials: true
                })
        }
        return this.http.post<Post>(postPath, post, { withCredentials: true })
    }


    public putPost(post: Post): Observable<Post> {
        return this.http.put<Post>(this.path + `post/${post.id}`, post, { withCredentials: true })
    }

    public deletePost(post: Post): Observable<Response> {
        return this.http.delete<Response>(`${this.path}post/${post.id}`, { withCredentials: true })
    }


    mapPost(post: any): Post {

        post.fileLinks = post.files
        post = post as Post

        post.created_at = this.datePipe.transform(post.created_at, 'HH:mm dd/MM/yyyy') ?? ''

        return this.filterResources(post)
    }

    filterResources(post: Post) {

        const files = this.fileSvc.mapFiles(post.fileLinks ?? [])

        post.fileLinks = files.files
        post.multimedia = files.multimedia

        const links = this.linkSvc.mapLinks(post.links ?? [])

        post.links = links.links
        post.videos = links.videos

        post.comments = this.commentSvc.mapComments(post.comments ?? [])

        return post
    }

}
