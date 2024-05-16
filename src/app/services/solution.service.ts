import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileService } from './resources/file.service';
import { LinkService } from './resources/link.service';
import { Observable } from 'rxjs';
import { Solution } from '../models/solution';

@Injectable({
	providedIn: 'root'
})
export class SolutionService {

	constructor(
		private http: HttpClient,
		private fileSvc: FileService,
		private linkSvc: LinkService
	) { }
	private path = 'http://localhost:8000/api'

	getSolution(id: string): Observable<Solution> {
		return this.http.get(`${this.path}solution/${id}`)
	}

	mapSolutions(solution : any){
		solution.fileLinks = solution.files
		solution = solution as Solution

		let files = this.fileSvc.mapFiles(solution.fileLinks)
		solution.multimedia = files.multimedia
		solution.files = files.files
		
		return solution
	}
}
