import { Injectable } from '@angular/core';
import axios from "axios";
import {environment} from "../../environments/environment.development";

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
}
