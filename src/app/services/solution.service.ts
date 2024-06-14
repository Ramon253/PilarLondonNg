import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FileService} from './resources/file.service';
import {LinkService} from './resources/link.service';
import {Observable} from 'rxjs';
import {Solution} from '../models/solution';
import {ValidationsService} from "./validations.service";
import {environment} from "../../environments/environment.development";
import axios from "axios";

axios.defaults.baseURL = environment.baseUrl
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true;

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

    async grade(id: string, note: number): Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
        return axios.put<any>( `/api/solution/${id}/grade`, {note: note})
    }

    async postSolution(id: string, solution: Solution, formData ?: FormData): Promise<{
        success: string,
        solution: Solution
    } | any> {
        await axios.get('/sanctum/csrf-cookie')
        if (formData) {
            return axios.post<{
                success: string,
                solution: Solution
            }>(`/api/assignment/${id}/response`, formData)
        }
        return axios.post<{
            success: string,
            solution: Solution
        }>(`/api/assignment/${id}/response`, solution)
    }

}
