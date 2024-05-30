import {Component, ElementRef, Renderer2, signal, viewChild} from '@angular/core';
import {AssignmentService} from "../../services/assignment.service";
import {LoginService} from "../../login.service";
import {Router, RouterLink} from "@angular/router";
import {Teacher} from "../../models/teacher";
import {TeacherService} from "../../services/teacher.service";
import {Assignment} from "../../models/assignment";
import {AssignmentCardComponent} from "../../assignments/assignment-card/assignment-card.component";
import {YourSolutionCardComponent} from "../../solution/your-solution-card/your-solution-card.component";

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
    imports: [
        AssignmentCardComponent,
        RouterLink,
        YourSolutionCardComponent
    ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent {

    percentageBar = viewChild<ElementRef>('percentageBar')
    isLoading = signal<boolean>(true)
    teacher = signal<Teacher>({})
    assignments = signal<Assignment[]>([])
    marked = signal<number>(0)

    constructor(
        private assignmentSvc : AssignmentService,
        private teacherSvc :TeacherService,
        public loginSvc : LoginService,
        private router : Router,
        private renderer : Renderer2
    ) {

    }

    ngOnInit(){
        this.teacherSvc.dashboard().then(
            res => {
                res.data.assignments.forEach((assignment : Assignment) => this.assignments().push(assignment) )
                this.teacher.set(res.data.teacher)
                this.marked.set(Math.round(parseFloat(res.data.marked)))
                this.isLoading.set(false)
                setTimeout(() => {
                    this.renderer.setStyle(this.percentageBar()?.nativeElement, 'transform', `translateX(-${100 -this.marked()}%)`)
                },10)
            }
        )
    }

}
