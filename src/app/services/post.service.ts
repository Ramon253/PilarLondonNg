import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Post} from '../models/post';
import {HttpClient} from '@angular/common/http';
import {Response} from '../models/response';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(private http: HttpClient) {
    }

    private path = 'http://localhost:8000/api/'

    public getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.path + 'posts', {withCredentials: true})
    }

    public getPost(post_id : string): Observable<Post> {
        return this.http.get<Post>(this.path + 'post/' + post_id, {withCredentials : true})
    }

    public postPost(post: Post): Observable<Post> {
        return this.http.post<Post>(this.path + `group/${post.group_id}/post`, post, {withCredentials: true})
    }

    public deletePost(post : Post) : Observable<Response> {
        return this.http.delete<Response>(`${this.path}post/${post.id}`, {withCredentials : true})
    }

    public checkLink(url: string): boolean {
        return url.includes('youtube') || url.includes('yout') || url.includes('drive.google.com');
    }
}
