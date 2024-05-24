import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Group} from "../models/group";
import {AssignmentService} from "./assignment.service";
import {PostService} from "./post.service";
import {DatePipe} from "@angular/common";
import {environment} from "../../environments/environment.development";
import Axios from "axios";
import axios from "axios";

axios.defaults.baseURL = environment.baseUrl;
axios.defaults.withCredentials = true
axios.defaults.withCredentials = true

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

    private path = environment.baseUrl + 'api/'

    async postGroup(group: FormData): Promise<Group | any> {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/group', group)
    }
    async putGroup(group : Group, id : string){
        await axios.get('/sanctum/csrf-cookie')
        return axios.put(`/api/group/${id}`, group)
    }
    async putBanner(formData : FormData, id : string){
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/group/' + id + '/banner', formData)
    }

    async joinGroup(group_id: string, student_id: string) {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post(`/api/group/${group_id}/join`, {student_id: student_id})
    }

    async leaveGroup(group_id: string, student_id: string) {
        await axios.get('/sanctum/csrf-cookie')
        return axios.delete(`/api/group/${group_id}/kick`, {
            data: {
                student_id: student_id
            }
        })
    }

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
        group.content.sort((a, b) => {
            console.log('a -------------')
            console.log(new Date(b.updated_at).getTime())
            console.log('b -------------')
            console.log(new Date(a.updated_at).getTime())
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        })
        console.log(group)
        return group
    }

    getTime(group: Group) {
        const [hours, minutes, seconds] = group.lessons_time?.split(':') ?? ''
        let from = new Date()
        from.setHours(+hours, +minutes)
        let to = new Date()
        to.setHours(from.getHours() + 1)
        to.setMinutes(from.getMinutes() + 15)
        return [this.datePipe.transform(from, 'HH:mm'), this.datePipe.transform(to, 'HH:mm')]
    }
}
