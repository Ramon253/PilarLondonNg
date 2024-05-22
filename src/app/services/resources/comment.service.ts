import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../models/properties/comment';
import { CommentComponent } from '../../resources/comment/comment.component';
import { DatePipe } from '@angular/common';
import { PostComponent } from '../../posts/post/post.component';
import { CommentsComponent } from '../../resources/comments/comments.component';
import {environment} from "../../../environments/environment.development";

@Injectable({
	providedIn: 'root'
})
export class CommentService {

	private path = `${environment.baseUrl}api/`

	constructor(private http: HttpClient, private datePipe: DatePipe) { }

	deleteComment(id: string, from: string): Observable<any> {
		return this.http.delete<any>(`${this.path}${from}/comment/${id}`, { withCredentials: true })
	}

	getComments(from: string, postId: string): Observable<Comment[]> {
		return this.http.get<Comment[]>(`${this.path}${from}/${postId}/comments`, {withCredentials : true})
	}

	postComment(comment: Comment, from: string): Observable<Response> {
		return this.http.post<Response>(`${this.path}${from}/${comment.post_id}/comment`, comment, { withCredentials: true })
	}



	createComment(from: string, CommentsComponent: CommentsComponent) {

		CommentsComponent.isLoadingPost.set(true)
		let content = CommentsComponent.commentPostForm.get('Comentario')?.value

		const comment = {
			content: content,
			public: !CommentsComponent.privateComments(),
			post_id: CommentsComponent.parent().id,
			parent_id: CommentsComponent.answerComment(),

		} as Comment

		this.postComment(comment as Comment, from).subscribe(
			(res: any) => {

				CommentsComponent.post.emit(res.comments as Comment[])
				CommentsComponent.isLoadingPost.set(false)
				CommentsComponent.commentPostForm.get('Comentario')?.setValue('')
				CommentsComponent.answerComment.set(undefined)
				CommentsComponent.answerTo.set(undefined)
			},
			error => {
				console.error(error)
				CommentsComponent.commentPostForm.get('Comentario')?.setErrors({ required: true })
				CommentsComponent.isLoadingPost.set(false)
			}
		)
	}


	mapComments(comments: Comment[]) : Comment[] {
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
