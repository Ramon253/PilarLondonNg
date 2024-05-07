import { Component, EventEmitter, Output, SimpleChanges, effect, input, signal } from '@angular/core';
import { Comment } from '../../models/properties/comment';
import { LoginService } from '../../login.service';

@Component({
	selector: 'app-comment',
	standalone: true,
	imports: [],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.css'
})
export class CommentComponent {

	@Output('answer') answerComment = new EventEmitter<{ id?: string, name?: string }>()

	answer(answer?: {}) {
		this.answerComment.emit(answer ?? { id: this.comment()?.id, name: this.comment()?.user_name })
	}

	constructor(
		public loginSvc : LoginService
	) { }

	ngOnChanges(changes: SimpleChanges) {
		this.ownAnswers.set(this.answerComments()?.filter(
			comment => comment.parent_id === this.comment()?.id
		) ?? [])
		if (!this.comment()?.public)
			console.log(this.ownAnswers());
		
	}

	ngOnInit() {
		this.ownAnswers.set(this.answerComments()?.filter(
			comment => comment.parent_id === this.comment()?.id
		) ?? [])

		
	}

	showAnswers = signal<boolean>(false)
	answerComments = input<Comment[]>()
	comment = input<Comment>()

	ownAnswers = signal<Comment[]>([])
}
