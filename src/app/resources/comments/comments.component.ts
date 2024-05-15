import { Component, input, output, signal } from '@angular/core';
import { CommentService } from '../../services/resources/comment.service';
import { publishFacade } from '@angular/compiler';
import { LoginService } from '../../login.service';
import { Comment } from '../../models/properties/comment';
import { CommentComponent } from '../comment/comment.component';
import { PostComponent } from '../../posts/post/post.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingWheelComponent } from '../../svg/loading-wheel/loading-wheel.component';

@Component({
	selector: 'app-comments',
	standalone: true,
	imports: [CommentComponent, ReactiveFormsModule, LoadingWheelComponent],
	templateUrl: './comments.component.html',
	styles: ``
})
export class CommentsComponent {

	comments = input([], { transform: this.commentSvc.mapComments })
	parent = input.required<{ type: string, id: string }>()
	delete = output<string>()
	post = output<Comment[]>()

	isLoadingPost = signal<boolean>(false)
	isLoading = signal<boolean>(false)
	privateComments = signal<boolean>(false)
	answerComment = signal<string | undefined>(undefined)
	answerTo = signal<string | undefined>('')


	commentPostForm = new FormGroup({
		Comentario: new FormControl('', Validators.required)
	})

	constructor(
		private commentSvc: CommentService,
		public loginSvc: LoginService
	) { }


	answer(comment_id: string | undefined) {
		this.answerComment.set(comment_id)
	}

	deleteComment(id: string) {
		this.delete.emit(id)
	}

	postComment() {
		this.commentSvc.createComment(this.parent().type, this)
	}

	getComments(refreshButton: HTMLSpanElement) {
		this.isLoading.set(true)
		this.commentSvc.getComments(this.parent().type, this.parent().id).subscribe(
			res => {
				this.isLoading.set(false)
				this.post.emit(res)
			}
		)
	}
}
