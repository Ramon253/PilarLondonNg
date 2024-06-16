import {Injectable} from '@angular/core';
import axios from "axios";
import {environment} from "../../../environments/environment.development";

axios.defaults.baseURL = environment.baseUrl
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

@Injectable({
    providedIn: 'root'
})
export class MailService {

    async sendContact(mail: any) {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/contact', mail)
    }

    async sendCode(mailTo: string) : Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/mail/student-code', {'email': mailTo})
    }

    constructor() {
    }
}
