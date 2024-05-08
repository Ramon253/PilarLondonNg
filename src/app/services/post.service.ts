import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Post} from '../models/post';
import {HttpClient} from '@angular/common/http';
import {Response} from '../models/response';
import {Comment} from "../models/properties/comment";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(private http: HttpClient) {
    }

    private path = 'http://localhost:8000/api/'

    public getPosts(): Observable<{posts : Post[], groups? : []}> {
        return this.http.get<{posts : Post[], groups? : []}>(this.path + 'posts', {withCredentials: true})
    }

    public getPost(post_id: string): Observable<Post> {
        return this.http.get<Post>(this.path + 'post/' + post_id, {withCredentials: true})
    }

    public postPost(post: Post): Observable<Post> {
        return this.http.post<Post>(this.path + `group/${post.group_id}/post`, post, {withCredentials: true})
    }

    public deletePost(post: Post): Observable<Response> {
        return this.http.delete<Response>(`${this.path}post/${post.id}`, {withCredentials: true})
    }

    postComment(comment: Comment): Observable<Response> {
        return this.http.post<Response>(`${this.path}post/${comment.post_id}/comment`, comment , {withCredentials: true})
    }

}
