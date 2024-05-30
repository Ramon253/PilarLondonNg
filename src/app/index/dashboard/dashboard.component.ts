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
import {Solution} from "../../models/solution";
import {YourSolutionCardComponent} from "../../solution/your-solution-card/your-solution-card.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        RouterLink,
        AssignmentComponent,
        AssignmentCardComponent,
        YourSolutionCardComponent
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
    percentageNoteBar = viewChild<ElementRef>('percentageNoteBar')
    solutions = signal<Solution[]>([])
    avgNote = 0
    answered = 0

    showAssignments = signal<boolean>(false)

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
                this.answered = Math.round(100 - parseFloat( res.data.answered))
                this.solutions.set(res.data.solutions)
                this.avgNote = this.getAvgNote()
                setTimeout(() => {
                    this.renderer.setStyle(this.percentageBar()?.nativeElement, 'transform', `translateX(-${100 - this.answered}%)`)
                    this.renderer.setStyle(this.percentageNoteBar()?.nativeElement, 'transform', `translateX(-${100 - this.avgNote * 10}%)`)
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

    getAvgNote(){
        let sum = 0
        let number = 0
        this.solutions().forEach((sol) => {
            if (sol.note !== null){
                sum += parseFloat(sol.note ?? '')
                number++
            }
        })
        return Math.round((number === 0)? 0 :sum / number)
    }

    protected readonly indexedDB = indexedDB;
}
