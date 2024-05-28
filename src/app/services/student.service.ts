import {Injectable} from '@angular/core';
import axios from "axios";
import {environment} from "../../environments/environment.development";
import {Student} from "../models/student";

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

    getStudent(id : string){
        return axios.get('/api/student/' + id)
    }

    getProfile(){
        return axios.get('/api/student')
    }

    async generateCode(){
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/student/generate')
    }

    async putProfileImage(formData : FormData){
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/profile_picture', formData)
    }
    async activate(code : string){
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/activate', {join_code : code})
    }
    async putStudent(student : Student){
        await axios.get('/sanctum/csrf-cookie')
        return axios.put(`/api/student`, student)
    }

    async postStudent(student : FormData | Student){
        await  axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/student', student)
    }

    isActivated(){
        return axios.get('/api/isActivated')
    }
}
