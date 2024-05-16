import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FileService} from './resources/file.service';
import {LinkService} from './resources/link.service';
import {Observable} from 'rxjs';
import {Solution} from '../models/solution';
import {FileR} from "../models/properties/file";
import {ValidationsService} from "./validations.service";

@Injectable({
    providedIn: 'root'
})
export class SolutionService {

    constructor(
        private http: HttpClient,
        private fileSvc: FileService,
        private linkSvc: LinkService,
        private validator : ValidationsService,
    ) {
    }

    private path = 'http://localhost:8000/api'

    getSolution(id: string): Observable<Solution> {
        return this.http.get(`${this.path}solution/${id}`)
    }


    mapSolution(solution: Solution) {

    }
}
