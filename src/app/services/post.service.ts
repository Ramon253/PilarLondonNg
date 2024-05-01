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

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.path + 'posts', {withCredentials: true})
    }

    postPost(post: Post): Observable<Response> {
        return this.http.post<Response>(this.path + 'group/1/post', post, {withCredentials: true})
    }

    checkLink(url: string): boolean {
        return url.includes('youtube') || url.includes('yout');
    }
}
