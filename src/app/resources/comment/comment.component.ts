import { Component, EventEmitter, Output, SimpleChanges, effect, input, output, signal } from '@angular/core';
import { Comment } from '../../models/properties/comment';
import { LoginService } from '../../login.service';
import { CommentService } from '../../services/resources/comment.service';
import { LoadingWheelComponent } from '../../svg/loading-wheel/loading-wheel.component';

@Component({
	selector: 'app-comment',
	standalone: true,
	imports: [LoadingWheelComponent],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.css'
})
export class CommentComponent {

	@Output('answer') answerComment = new EventEmitter<{ id?: string, name?: string }>()
	answer(answer?: {}) {
		this.answerComment.emit(answer ?? { id: this.comment()?.id, name: this.comment()?.user_name })
	}
	parent = input.required<string>()

	constructor(
		public loginSvc : LoginService,
		private commentSvc : CommentService
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
	isLoadingDelete = signal<boolean>(false)

	delete = output<string>()


	
    deleteComment(){
		this.isLoadingDelete.set(true)

        this.commentSvc.deleteComment(this.comment()?.id ?? '', this.parent()).subscribe(
            res => {
				this.isLoadingDelete.set(false)
                this.delete.emit(this.comment()?.id ?? '')
            }
        )
    }
}
