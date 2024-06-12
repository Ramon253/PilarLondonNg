import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FileService} from './resources/file.service';
import {LinkService} from './resources/link.service';
import {Observable} from 'rxjs';
import {Solution} from '../models/solution';
import {FileR} from "../models/properties/file";
import {ValidationsService} from "./validations.service";
import {environment} from "../../environments/environment.development";
import axios from "axios";

@Injectable({
    providedIn: 'root'
})
export class SolutionService {

    constructor(
        private http: HttpClient,
        private fileSvc: FileService,
        private linkSvc: LinkService,
        private validator: ValidationsService,
    ) {
    }

    private path = environment.baseUrl + 'api/'

    getSolution(id: string): Observable<Solution> {
        return this.http.get<Solution>(`${this.path}solution/${id}`, {withCredentials: true})
    }

    grade(id: string, note: number): Observable<any> {
        return this.http.put<any>(this.path + `solution/${id}/grade`, {note: note}, {withCredentials: true})
    }

    postSolution(id: string, solution: Solution, formData ?: FormData): Observable<{
        success: string,
        solution: Solution
    }> {
        if (formData) {
            return this.http.post<{
                success: string,
                solution: Solution
            }>(this.path + `assignment/${id}/response`, formData, {withCredentials: true})
        }
        return this.http.post<{
            success: string,
            solution: Solution
        }>(this.path + `assignment/${id}/response`, solution, {withCredentials: true})
    }

}
