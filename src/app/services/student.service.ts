import {Injectable} from '@angular/core';
import axios from "axios";
import {environment} from "../../environments/environment.development";

axios.defaults.baseURL = environment.baseUrl
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    constructor() {
    }

    getStudents() {
        return axios.get('/api/students')
    }
}
