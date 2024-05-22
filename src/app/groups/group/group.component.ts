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


@Component({
    selector: 'app-group',
    standalone: true,
    imports: [
        AssignmentCardComponent,
        PostCardComponent,
        StudentCardComponent
    ],
    templateUrl: './group.component.html',
    styles: ``
})
export class GroupComponent {

    group = signal<Group>({})
    isLoading = signal<boolean>(true)
    selectedContent = signal<string>('general')

    constructor(
        private route: ActivatedRoute,
        public loginSvc: LoginService,
        public groupSvc: GroupService,
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
