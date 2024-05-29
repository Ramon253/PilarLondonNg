import {Component, ElementRef, Renderer2, signal, viewChild} from '@angular/core';
import {LoginService} from "../../login.service";
import {StudentService} from "../../services/student.service";
import {Student} from "../../models/student";
import {Group} from "../../models/group";
import {AssignmentService} from "../../services/assignment.service";
import {Assignment} from "../../models/assignment";
import {Router, RouterLink} from "@angular/router";
import {FlashMessageService} from "../../services/flash-message.service";
import {AssignmentComponent} from "../../assignments/assignment/assignment.component";
import {AssignmentCardComponent} from "../../assignments/assignment-card/assignment-card.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        RouterLink,
        AssignmentComponent,
        AssignmentCardComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    isLoading = signal<boolean>(true)
    student = signal<Student>({})
    groups = signal<Group[]>([])
    assignments = signal<Assignment[]>([])
    percentageBar = viewChild<ElementRef>('percentageBar')
    answered = 0

    constructor(
        public loginSvc: LoginService,
        private studentSvc: StudentService,
        private assignmentSvc: AssignmentService,
        private router: Router,
        private flashMessageSvc: FlashMessageService,
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        this.studentSvc.dashboard().then(
            res => {
                this.student.set(res.data.student)
                this.groups.set(res.data.groups)
                res.data.assignments.forEach((assignment: Assignment) => this.assignments().push(this.assignmentSvc.mapAssignment(assignment)))
                this.answered = res.data.answered
                setTimeout(() => {
                    this.renderer.setStyle(this.percentageBar()?.nativeElement, 'transform', `translateX(-${100 - this.answered}%)`)
                }, 10)
            }
        ).catch(
            err => {
                console.log(err)
                if (err.status === 500 || err.code === 'ERR_NETWORK' || err.isAxiosError) {
                    this.flashMessageSvc.messages().push(this.loginSvc.serverErrorMessage)
                }
                if (err.status === 401) {
                    this.router.navigate(['/login'])
                }
            }
        ).finally(() => this.isLoading.set(false))

    }

}
