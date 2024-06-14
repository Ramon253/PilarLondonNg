import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../models/properties/comment';
import { CommentComponent } from '../../resources/comment/comment.component';
import { DatePipe } from '@angular/common';
import { PostComponent } from '../../posts/post/post.component';
import { CommentsComponent } from '../../resources/comments/comments.component';
import {environment} from "../../../environments/environment.development";
import axios from "axios";

axios.defaults.baseURL = environment.baseUrl
axios.defaults.withCredentials = true

@Injectable({
	providedIn: 'root'
})
export class CommentService {

	private path = `${environment.baseUrl}api/`

	constructor(private http: HttpClient, private datePipe: DatePipe) { }

	async deleteComment(id: string, from: string): Promise<any> {
        await axios.get('sanctum/csrf-cookie')
		return axios.delete<any>(`/api/${from}/comment/${id}`)
	}

	getComments(from: string, postId: string): Observable<Comment[]> {
		return this.http.get<Comment[]>(`${this.path}${from}/${postId}/comments`, {withCredentials : true})
	}

	async postComment(comment: Comment, from: string): Promise<Response | any> {
        await axios.get('sanctum/csrf-cookie')
		return axios.post<Response>(`/api/${from}/${comment.post_id}/comment`, comment)
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

		this.postComment(comment as Comment, from).then(
			(res: any) => {
				CommentsComponent.post.emit(res.data.comments as Comment[])
				CommentsComponent.isLoadingPost.set(false)
				CommentsComponent.commentPostForm.get('Comentario')?.setValue('')
				CommentsComponent.answerComment.set(undefined)
				CommentsComponent.answerTo.set(undefined)
			},
			error => {
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
