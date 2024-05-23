import {Component, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../login.service";
import {GroupService} from "../../services/group.service";
import {PostService} from "../../services/post.service";
import {AssignmentService} from "../../services/assignment.service";
import {Group} from "../../models/group";
import {AssignmentCardComponent} from "../../assignments/assignment-card/assignment-card.component";
import {PostCardComponent} from "../../posts/post-card/post-card.component";
import {StudentCardComponent} from "../../students/student-card/student-card.component";
import {environment} from "../../../environments/environment.development";
import {DialogComponent} from "../../dialog/dialog.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {Student} from "../../models/student";
import {StudentService} from "../../services/student.service";
import {tryUnwrapForwardRef} from "@angular/compiler-cli/src/ngtsc/annotations/common";
import {PostCreationFormComponent} from "../../posts/post-creation-form/post-creation-form.component";
import {AssignmentFormComponent} from "../../assignments/assignment-form/assignment-form.component";


@Component({
    selector: 'app-group',
    standalone: true,
    imports: [
        AssignmentCardComponent,
        PostCardComponent,
        StudentCardComponent,
        DialogComponent,
        LoadingWheelComponent,
        PostCreationFormComponent,
        AssignmentFormComponent
    ],
    templateUrl: './group.component.html',
    styles: ``
})
export class GroupComponent {

    group = signal<Group>({})
    isLoading = signal<boolean>(true)
    isLoadingStudents = signal<boolean>(false)
    isLoadingPost = signal<boolean>(false)
    isLoadingKick = signal<boolean>(false)
    selectedContent = signal<string>('general')
    students = signal<Student[]>([])
    showCreate = signal<any>({
        post: false,
        assignment: false,
        student: false
    })

    constructor(
        private route: ActivatedRoute,
        public loginSvc: LoginService,
        public groupSvc: GroupService,
        private studentSvc: StudentService,
        private postSvc: PostService,
        private assignmentSvc: AssignmentService,
        private router: Router,
    ) {
    }


    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.groupSvc.getGroup(params['group']).subscribe(
                    res => {
                        this.group.set(this.groupSvc.mapGroup(res))
                        this.isLoading.set(false)
                    }
                );
            }
        )
    }

    addStudent(select: HTMLSelectElement) {
        this.isLoadingPost.set(true)
        this.groupSvc.joinGroup(this.group().id ?? '', select.value).then(
            res => {
                this.isLoadingPost.set(false)
                this.showCreate().student = false
                this.group().students?.push(this.students().find(student => student.id == select.value) ?? {})
            }
        )
    }
    kickStudent(student_id : string){
        this.isLoadingKick.set(true)
        this.groupSvc.leaveGroup(this.group().id ?? '', student_id).then(
            res => {
                this.isLoadingKick.set(false)
                this.group().students = this.group().students?.filter(student => student.id !== student_id)
            }
        )
    }

    create() {
        switch (this.selectedContent()) {
            case 'student' : {
                this.showCreate().student = true
                this.isLoadingStudents.set(true)
                this.studentSvc.getStudents().then(
                    res => {
                        const students = this.group().students
                            ?.map(student => student.id)
                        this.students.set(res.data
                            .filter((student: Student) => !students?.includes(student.id)))
                        this.isLoadingStudents.set(false)
                    }
                )
                break;
            }
            case 'post' : {
                this.showCreate().post = true
                break;
            }
            case 'assignment' : {
                this.showCreate().assignment = true
                break
            }
        }
    }

    getTab() {
        switch (this.selectedContent()) {
            case 'general' :
                return 'translate-x-0';
            case 'post' :
                return 'translate-x-28';
            case 'assignment':
                return 'translate-x-56';
            case 'student' :
                return 'translate-x-[21rem]';
        }
        return ''
    }

    protected readonly environment = environment;
}
