import {Component, ElementRef, Renderer2, signal, viewChild} from '@angular/core';
import {PostCardComponent} from "../posts/post-card/post-card.component";
import {PostCreationFormComponent} from "../posts/post-creation-form/post-creation-form.component";
import {Assignment} from "../models/assignment";
import {AssignmentService} from "../services/assignment.service";
import {LoginService} from "../login.service";
import {FileService} from "../services/resources/file.service";
import {LinkService} from "../services/resources/link.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {Router} from "@angular/router";
import {AssignmentCardComponent} from "./assignment-card/assignment-card.component";
import {DialogComponent} from "../dialog/dialog.component";
import {AssignmentFormComponent} from "./assignment-form/assignment-form.component";

@Component({
    selector: 'app-assignments',
    standalone: true,
    imports: [
        PostCardComponent,
        PostCreationFormComponent,
        AssignmentCardComponent,
        DialogComponent,
        AssignmentFormComponent
    ],
    templateUrl: './assignments.component.html',
    styles: ``
})
export class AssignmentsComponent {
    assignments = signal<Assignment[]>([])
    underlineTab = viewChild<ElementRef>('underLineTab')
    isLoading = signal<boolean>(true)
    showPostForm = signal<boolean>(false)
    groups = signal<any[]>([])
    show = {
        all: true,
        answered: false,
        toDo: false,
        unmarked: false
    }

    constructor(
        private assignmentSvc: AssignmentService,
        public loginSvc: LoginService,
        private fileSvc: FileService,
        private linkSvc: LinkService,
        private router: Router,
        private renderer : Renderer2
    ) {
    }

    getAssignments(filter: boolean) {
        this.assignmentSvc.getAssignments().subscribe(
            (res) => {
                if (res.groups) {
                    this.groups.set(res.groups)
                }
                if (filter) {
                    this.assignments.set(res.assignments.filter(assignment => {
                        if (this.show.all) return true
                        if (this.show.answered) return assignment.resolved
                        if (this.show.unmarked) return (assignment.marked ?? 1) < (assignment.submitted ?? 1)
                        return !assignment.resolved
                    }))
                } else
                    this.assignments.set(res.assignments.map(assignment => {
                        return this.assignmentSvc.mapAssignment(assignment)
                    }))
                this.isLoading.set(false)
            },
            error => {
                if (error.status === 401) {
                    this.loginSvc.logoutFront()
                    this.router.navigate(['/login'])
                }
            }
        )
    }

    changeFilter() {
        this.isLoading.set(true)
        this.getAssignments(true)
    }

    changeTab() {
        let translate = ''
        if (this.show.answered || this.show.toDo) {
            translate = 'translate-x-[110%]'
        } else if (this.show.unmarked) {
            translate = 'translate-x-[70%] w-[160%]'
        }
        return translate
    }

    deleteAssignment(id: string) {
        this.assignments.set(this.assignments().filter((assignment) => assignment.id !== id))

    }

    resetTabs() {
        this.show = {
            all: false,
            answered: false,
            toDo: false,
            unmarked: false
        }
    }

    filter() {

    }

    ngOnInit() {
        this.getAssignments(false)
    }
}
