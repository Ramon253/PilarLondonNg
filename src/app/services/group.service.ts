import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Group} from "../models/group";
import {AssignmentService} from "./assignment.service";
import {PostService} from "./post.service";
import {DatePipe} from "@angular/common";
import {environment} from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    constructor(
        private http: HttpClient,
        private assignmentSvc: AssignmentService,
        private postSvc: PostService,
        private datePipe: DatePipe
    ) {
    }

    private path = environment.baseUrl +'api/'

    getGroups(): Observable<Group[]> {
        return this.http.get<Group[]>(this.path + 'groups', {withCredentials: true})
    }

    getGroup(id: string): Observable<Group> {
        return this.http.get<Group>(this.path + `group/${id}`, {withCredentials: true})
    }

    mapGroup(group: Group) {
        group.assignments = group.assignments?.map(
            assignment => this.assignmentSvc.mapAssignment(assignment)
        )

        group.posts = group.posts?.map(
            post => this.postSvc.mapPost(post)
        )
        group.content = []

        group.content?.push(...group.posts ?? [])
        group.content?.push(...group.assignments ?? [])
        group.content.sort((a,b) => {
            console.log('a -------------')
            console.log(new Date(b.updated_at).getTime())
            console.log('b -------------')
            console.log(new Date(a.updated_at).getTime())
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        })
        console.log(group)
        return group
    }

    getDate(group: Group) {
        const [hours, minutes, seconds] = group.lessons_time?.split(':') ?? ''
        let from = new Date()
        from.setHours(+hours, +minutes)
        let to = new Date()
        to.setHours(from.getHours() + 1)
        to.setMinutes(from.getMinutes() + 15)
        return [this.datePipe.transform(from, 'HH:mm'), this.datePipe.transform(to, 'HH:mm')]
    }
}
