import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../models/properties/comment';
import { CommentComponent } from '../../resources/comment/comment.component';
import { DatePipe } from '@angular/common';
import { PostComponent } from '../../posts/post/post.component';

@Injectable({
	providedIn: 'root'
})
export class CommentService {

	private path = `http://localhost:8000/api/`

	constructor(private http: HttpClient, private datePipe: DatePipe) { }

	deleteComment(id: string, from: string): Observable<any> {
		return this.http.delete<any>(`${this.path}${from}/comment/${id}`, { withCredentials: true })
	}

	getComments(from: string, postId: string): Observable<Comment[]> {
		return this.http.get<Comment[]>(`${this.path}${from}/${postId}/comments`)
	}

	postComment(comment: Comment, from: string): Observable<Response> {
		return this.http.post<Response>(`${this.path}${from}/${comment.post_id}/comment`, comment, { withCredentials: true })
	}

	

	createComment(from: string, fromComponent: PostComponent) {

		fromComponent.isLoadingPost.set(true)
		let content = fromComponent.postForm.get('Comentario')?.value

		const comment = {
			content: content,
			public: !fromComponent.privateComments(),
			post_id: fromComponent.post().id,
			parent_id: fromComponent.answerComment(),

		} as Comment

		this.postComment(comment as Comment, from).subscribe(
			(res: any) => {

				fromComponent.post().comments = this.mapComments(res.comments as Comment[])

				fromComponent.isLoadingPost.set(false)
				fromComponent.postForm.get('Comentario')?.setValue('')
				fromComponent.answerComment.set(undefined)
				fromComponent.answerTo.set(undefined)
			},
			error => {
				console.error(error)
				fromComponent.postForm.get('Comentario')?.setErrors({ required: true })
				fromComponent.isLoadingPost.set(false)
			}
		)
	}


	mapComments(comments: Comment[]) {
		try {
			return comments.map((comment: Comment) => {
				comment.created_at = this.datePipe.transform(comment.created_at, 'HH:mm dd/MM/yyyy') ?? ''
				return comment
			})
		} catch (e) {
			return comments
		}
	}
}
