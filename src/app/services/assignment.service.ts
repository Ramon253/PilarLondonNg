import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assignment } from '../models/assignment';
import { Observable } from 'rxjs';
import { FileService } from './resources/file.service';
import { LinkService } from './resources/link.service';
import { CommentService } from './resources/comment.service';
import { DatePipe } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class AssignmentService {

	constructor(
		private http: HttpClient,
		private fileSvc : FileService,
		private linkSvc : LinkService,
		private commentSvc : CommentService,
		private datePipe : DatePipe
	) { }

	private path ='http://localhost:8000/api/';

	getAssignments() : Observable<Assignment[]>{
		return this.http.get<Assignment[]>(this.path + 'asssignments', {withCredentials : true})
	}

	getAssignment(id : string) : Observable<Assignment>{
		return this.http.get<Assignment>(this.path + `assignment/${id}`, {withCredentials : true})
	}

    deleteAssignment(id : string) : Observable<Assignment>
    {
        return this.http.get<Assignment>(this.path + 'assignment/' + id, {withCredentials : true})
    }
	putAssignment(assignment : Assignment) : Observable<any> {
		return this.http.put<any>(this.path + `assignment/${assignment.id}`, assignment, {withCredentials : true})
	}

	mapAssignment(assignment : any) : Assignment
	{
		assignment.fileLinks = assignment.files
		assignment = assignment as Assignment

		assignment.created_at = this.datePipe.transform(assignment.created_at, 'HH:mm dd/MM/yyyy')
		assignment.updated_at = this.datePipe.transform(assignment.updated_at, 'HH:mm dd/MM/yyyy')
		assignment.dead_line = this.datePipe.transform(assignment.dead_line, 'HH:mm dd/MM/yyyy')

		return this.mapResources(assignment)
	}

	mapResources(assignment : Assignment) : Assignment{
		const files = this.fileSvc.mapFiles(assignment.fileLinks ?? [])
		assignment.fileLinks = files.files
		assignment.multimedia = files.multimedia

		const links = this.linkSvc.mapLinks(assignment.links ?? [])
		assignment.links = links.links
		assignment.videos = links.videos

		assignment.comments = this.commentSvc.mapComments(assignment.comments ?? [])

		return assignment
	}
}