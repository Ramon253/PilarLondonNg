import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Assignment} from '../models/assignment';
import {Observable} from 'rxjs';
import {FileService} from './resources/file.service';
import {LinkService} from './resources/link.service';
import {CommentService} from './resources/comment.service';
import {DatePipe} from '@angular/common';
import {SolutionService} from './solution.service';

@Injectable({
    providedIn: 'root'
})
export class AssignmentService {

    constructor(
        private http: HttpClient,
        private fileSvc: FileService,
        private linkSvc: LinkService,
        private commentSvc: CommentService,
        private datePipe: DatePipe,
        private solutionSvc: SolutionService
    ) {
    }

    private path = 'http://localhost:8000/api/';

    getAssignments(): Observable<Assignment[]> {
        return this.http.get<Assignment[]>(this.path + 'asssignments', {withCredentials: true})
    }

    getAssignment(id: string): Observable<Assignment> {
        return this.http.get<Assignment>(this.path + `assignment/${id}`, {withCredentials: true})
    }

    deleteAssignment(id: string): Observable<Assignment> {
        return this.http.delete<Assignment>(this.path + 'assignment/' + id, {withCredentials: true})
    }

    putAssignment(assignment: Assignment): Observable<any> {
        return this.http.put<any>(this.path + `assignment/${assignment.id}`, assignment, {withCredentials: true})
    }

    mapAssignment(assignment: any): Assignment {

        assignment.fileLinks = assignment.files
        assignment = assignment as Assignment
        assignment.created_at = this.datePipe.transform(assignment.created_at, 'HH:mm dd/MM/yyyy')

        assignment.updated_at = this.datePipe.transform(assignment.updated_at, 'HH:mm dd/MM/yyyy')

        assignment.show_dead_line = this.datePipe.transform(assignment.dead_line, 'HH:mm dd/MM/yyyy')
        assignment.dead_line = assignment.dead_line as Date

        return this.mapResources(assignment)
    }

    mapResources(assignment: Assignment): Assignment {
        const files = this.fileSvc.mapFiles(assignment.fileLinks ?? [])
        assignment.fileLinks = files.files
        assignment.multimedia = files.multimedia

        const links = this.linkSvc.mapLinks(assignment.links ?? [])
        assignment.links = links.links
        assignment.videos = links.videos

        assignment.comments = this.commentSvc.mapComments(assignment.comments ?? [])

        if (assignment.solution) {
            let solution = assignment.solution
            let solutionFiles = this.fileSvc.mapFiles(solution.fileLinks ?? [])

            solution.fileLinks = solutionFiles.files
            solution.multimedia = solutionFiles.multimedia
        }

        return assignment
    }
}
