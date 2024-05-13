import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../models/properties/comment';

@Injectable({
	providedIn: 'root'
})
export class CommentService {

	private path = `http://localhost:8000/api/`

	constructor(private http: HttpClient) { }

	deleteComment(id: string, from: string): Observable<any> {
		return this.http.delete<any>(`${this.path}${from}/comment/${id}`, { withCredentials: true })
	}

	
    postComment(comment: Comment, from : string): Observable<Response> {
        return this.http.post<Response>(`${this.path}${from}/${comment.post_id}/comment`, comment, {withCredentials: true})
    }


}
