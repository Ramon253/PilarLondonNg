import { Component, ElementRef, output, signal, viewChild } from '@angular/core';
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
import { DialogComponent } from "../../dialog/dialog.component";
import { Comment } from "../../models/properties/comment";
import { FileComponent } from "../../resources/file/file.component";
import { LinkComponent } from "../../resources/link/link.component";
import { Link } from "../../models/properties/link";
import { FileR } from "../../models/properties/file";
import 'cally';
import { FormPostComponent } from "../../resources/form-post/form-post.component";
import { DatePipe } from '@angular/common';
import { SolutionService } from '../../services/solution.service';
import {SolutionCardComponent} from "../../resources/solution-card/solution-card.component";
import {Solution} from "../../models/solution";
import {YourSolutionComponent} from "../../solution/your-solution/your-solution.component";
import {SolutionPostFormComponent} from "../../resources/solution-post-form/solution-post-form.component";
import {SolutionComponent} from "../../solution/solution.component";

@Component({
	selector: 'app-assignment',
	standalone: true,
	imports: [LoadingWheelComponent, YoutubeVideoComponent, CommentsComponent, MultimediaComponent, DialogComponent, FileComponent, LinkComponent, FormPostComponent, SolutionCardComponent, YourSolutionComponent, SolutionPostFormComponent, SolutionComponent],
	templateUrl: './assignment.component.html',
	styles: ``,

})
export class AssignmentComponent {
	isLoadingFile = false
	isLoadingLink = false

	now = new Date()

	isLoading = signal<boolean>(true)
	isLoadingDelete = signal<boolean>(false)
	isLoadingPostResource = signal<boolean>(false)
	updateAny = signal<boolean>(false)

	showDeleteDialog = signal<boolean>(false)
	showPostDialog = signal<boolean>(false)
    showSolutionFormDialog = signal<boolean>(false)
    showSolutionDialog = signal<boolean>(false)
    selectedSolution = signal<string>('')

	groups = signal<{ name: string, id: string }[]>([])
	assignment = signal<Assignment>({
		name: '',
		group_id: ''
	})
	update = signal<any>({
		name: false,
		dead_line: false,
		description: false,
		group_id: false,
		files: false,
		links: false
	})

	nameInput = viewChild<ElementRef>('nameInput')
	groupInput = viewChild<ElementRef>('group_select')
	descriptionInput = viewChild<ElementRef>('descriptionInput')
	dead_line = viewChild<ElementRef>('dead_line')


	inputLinks = signal<Link[]>([])
	inputFiles = signal<File[]>([])

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
		if (this.update().dead_line) {
			this.assignment().dead_line = this.dead_line()?.nativeElement.value
			this.assignment().show_dead_line = this.datePipe.transform(this.assignment().dead_line, 'HH:mm dd/MM/yyyy') ?? ''
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


	getDead_line() {
		try {
			return this.datePipe.transform(this.assignment().dead_line, 'M/d/yy, h:mm a')
		} catch (err) {
			return this.assignment().dead_line
		}

	}

	getAssignment = (assignment: Assignment) => {
		this.isLoading.set(false)
		if (assignment.groups)
			this.groups.set(assignment.groups)
		this.assignment.set(this.assignmentSvc.mapAssignment(assignment))
	}



	private restartUpdate() {
		this.update.set(
			{
				name: false,
				dead_line: false,
				description: false,
				group_id: false,
				files: false,
				links: false
			}
		)
        this.updateAny.set(false)
	}



	triggerResize(textArea: HTMLTextAreaElement) {
		while (textArea.scrollHeight > textArea.clientHeight) {
			textArea.rows += 1
		}
	}
	deleteLink(id: string, isVideo: boolean) {
		if (isVideo) {
			this.assignment().videos = this.assignment().videos?.filter(link => link.id !== id)
			return
		}
		this.assignment().links = this.assignment().links?.filter(link => link.id !== id)

	}
	deleteFile(id: string, isMultimedia: boolean) {
		if (isMultimedia) {
			this.assignment().multimedia = this.assignment().multimedia?.filter(file => file.id.toString() !== id)
			return
		}
		this.assignment().fileLinks = this.assignment().fileLinks?.filter(file => file.id.toString() !== id)

	}
	deleteComment(id: string) {
		this.assignment().comments = this.assignment().comments?.filter(comment => comment.id !== id)
	}

	postComment(comments: Comment[]) {
		this.assignment().comments = comments
	}

	deleteAssignment() {
		this.isLoadingDelete.set(true)
		this.assignmentSvc.deleteAssignment(this.assignment().id ?? '').subscribe(
			res => {
				this.router.navigate(['/assignments'])
			}
		)
	}
	hasResources() {
		return this.assignment().links?.length !== 0 || this.assignment().fileLinks?.length !== 0
	}


	postResource() {
		this.isLoadingPostResource.set(true)

		if (this.inputFiles().length !== 0) {
			this.fileSvc.createFiles('assignment', this, this.assignment())
		}
		if (this.inputLinks().length !== 0) {
			this.linkSvc.createLinks('assignment', this, this.assignment())
		}
	}

	transformDateToInput(date: string) {
		return new Date(date)
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
	constructor(
		public loginSvc: LoginService,
		private fileSvc: FileService,
		private linkSvc: LinkService,
		public commentSvc: CommentService,
		private assignmentSvc: AssignmentService,
		private route: ActivatedRoute,
		private router: Router,
		private validator: ValidationsService,
		public datePipe: DatePipe,
		private solutionSvc : SolutionService
	) { }

    protected readonly alert = alert;
}
