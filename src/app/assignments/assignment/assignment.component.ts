import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { LoadingWheelComponent } from '../../svg/loading-wheel/loading-wheel.component';
import { LoginService } from '../../login.service';
import { FileService } from '../../services/resources/file.service';
import { LinkService } from '../../services/resources/link.service';
import { CommentService } from '../../services/resources/comment.service';
import { AssignmentService } from '../../services/assignment.service';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { ValidationsService } from '../../services/validations.service';
import { Assignment } from '../../models/assignment';
import { YoutubeVideoComponent } from '../../posts/youtube-video/youtube-video.component';
import { CommentsComponent } from '../../resources/comments/comments.component';
import { MultimediaComponent } from '../../multimedia/multimedia.component';

@Component({
	selector: 'app-assignment',
	standalone: true,
	imports: [LoadingWheelComponent, YoutubeVideoComponent, CommentsComponent, MultimediaComponent],
	templateUrl: './assignment.component.html',
	styles: ``
})
export class AssignmentComponent {
	isLoading = signal<boolean>(true)
	groups = signal<{ name: string, id: string }[]>([])
	assignment = signal<Assignment>({
		name: '',
		group_id: ''
	})
	updateAny = signal<boolean>(false)
	update = signal<any>({
		name: false,
		dead_line: false,
		description: false,
		group_id: false,
		files: false,
		links: false
	})

	nameInput = viewChild<ElementRef>('nameInput')
	groupInput = viewChild<ElementRef>('groupInput')
	descriptionInput = viewChild<ElementRef>('descriptionInput')

	updateAssignment() {
		if (this.update().name) {
			this.assignment().name = this.nameInput()?.nativeElement.value
		}
		if (this.update().group_id) {
			this.assignment().group_id = this.groupInput()?.nativeElement.value
			this.assignment().group_name = this.groups().find((group) => this.assignment().group_id == group.id)?.name
		}
		if (this.update().description) {
			this.assignment().description = this.descriptionInput()?.nativeElement.value
		}
		this.assignmentSvc.putAssignment(this.assignment()).subscribe(
			res => {
				this.getAssignment(res.assignment)
			},
			err => {
				this.assignmentSvc.getAssignment(this.assignment().id ?? '').subscribe(
					this.getAssignment
				)
			}
		)
		this.restartUpdate()
	}



	getAssignment = (assignment: Assignment) => {
		this.isLoading.set(false)
		this.groups.set(assignment.groups)
		this.assignment.set(this.assignmentSvc.mapAssignment(assignment))
	}

	private restartUpdate() {
		this.update().set(
			{
				name: false,
				dead_line: false,
				description: false,
				group_id: false,
				files: false,
				links: false
			}
		)
	}

	ngOnInit() {
		this.route.params.subscribe(
			params => {
				this.assignmentSvc.getAssignment(params['assignment']).subscribe(
					this.getAssignment
				)
			}
		)
	}

	triggerResize(textArea: HTMLTextAreaElement) {
        while (textArea.scrollHeight > textArea.clientHeight) {
            textArea.rows += 1
        }
    }
	constructor(
		public loginSvc: LoginService,
		private fileSvc: FileService,
		private linkSvc: LinkService,
		private commentSvc: CommentService,
		private assignmentSvc: AssignmentService,
		private route: ActivatedRoute,
		private router: Router,
		private validator: ValidationsService
	) { }
}
