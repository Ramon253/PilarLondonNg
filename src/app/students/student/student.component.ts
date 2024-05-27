import {Component, signal} from '@angular/core';
import {StudentService} from "../../services/student.service";
import {LoginService} from "../../login.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Student} from "../../models/student";
import {environment} from "../../../environments/environment.development";
import {User} from "../../models/user/user";
import {Group} from "../../models/group";
import {Solution} from "../../models/solution";
import {GroupCardComponent} from "../../groups/group-card/group-card.component";
import {SolutionCardComponent} from "../../resources/solution-card/solution-card.component";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-student',
    standalone: true,
    imports: [
        GroupCardComponent,
        SolutionCardComponent,
        RouterLink
    ],
    templateUrl: './student.component.html',
    styles: ``
})
export class StudentComponent {
    student = signal<Student>({})
    user = signal<User>({
        name: '',
        email: '',
        id: '',
        password: ''
    })
    parents = signal<User[]>([])
    groups = signal<Group[]>([])
    submissions = signal<Solution[]>([])
    unmarkedSolutions = 0
    show = signal<any>({
        data: true,
        solutions: false,
        groups: false
    })

    isLoading = signal<boolean>(true)

    constructor(
        private studentSvc: StudentService,
        public loginSvc: LoginService,
        private route: ActivatedRoute,
        private router: Router,
        public datePipe : DatePipe
    ) {
    }

    getTab() {
        if (this.show().data) return 'translate-x-0'
        if (this.show().groups) return 'translate-x-[100%]'
        if (this.show().solutions) return 'translate-x-[220%]'
        return ''
    }

    getAvgNote() {
        let avg = 0
        this.unmarkedSolutions = 0
        for (const submission of this.submissions()) {
            if (submission.note === null){
                this.unmarkedSolutions++
                continue;
            }

            avg += parseFloat(submission.note ?? '')
        }
        return avg / (this.submissions().length - this.unmarkedSolutions)
    }



    ngOnInit() {

        if (this.router.url.includes('profile')){
            this.studentSvc.getProfile().then(
                res =>this.mapProfile(res)
            )
            return
        }
        this.route.params.subscribe(
            params => {
                this.studentSvc.getStudent(params['student']).then(
                    res => {
                      this.mapProfile(res)
                    }
                )
            }
        )
    }
    private mapProfile = (res : any) =>{
        this.isLoading.set(false)
        this.student.set(res.data.student)
        this.parents.set(res.data.parents)
        this.user.set(res.data.user)
        this.submissions.set(res.data.submissions)
        this.groups.set(res.data.groups)
    }
    resetShow(){
        this.show.set({
            data: false,
            solutions: false,
            groups: false

        })
    }
    protected readonly environment = environment;
    protected readonly parseInt = parseInt;
}
