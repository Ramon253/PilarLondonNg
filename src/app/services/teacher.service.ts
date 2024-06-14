import { Injectable } from '@angular/core';
import axios from "axios";
import {environment} from "../../environments/environment.development";
import {Teacher} from "../models/teacher";

axios.defaults.baseURL = environment.baseUrl
axios.defaults.withXSRFToken = true
axios.defaults.withCredentials = true

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor() { }

    dashboard(){
      return axios.get('/api/teacher/dashboard')
    }
    getProfile() {
      return axios.get('/api/teacher/profile')
    }
    async putProfileImage(formData : FormData){
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/teacher/profile_picture', formData)
    }
    async putTeacher(teacher : Teacher){
      await axios.get('/sanctum/csrf-cookie')
        return axios.put('/api/teacher' , teacher)
    }
}
