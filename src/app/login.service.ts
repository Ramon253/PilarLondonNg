import {HttpClient} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {Observable} from 'rxjs';
import {UserResponse} from './models/user/userResponse';
import {Credentials} from './models/credentials';
import {User} from './models/user/user';
import axios, {AxiosResponse} from 'axios';
import {environment} from "../environments/environment.development";
import {Router} from "@angular/router";
import {FlashMessageService} from "./services/flash-message.service";
import {FlashMessage} from "./models/flash-message";

axios.defaults.withCredentials = true
axios.defaults.baseURL = environment.baseUrl
axios.defaults.withXSRFToken = true;


@Injectable({
    providedIn: 'root'
})
export class LoginService {
    public isLogged = signal<boolean>(JSON.parse(localStorage.getItem('isLogged') ?? 'false'))
    user = signal<User | null>(null)

    constructor(
        private http: HttpClient,
        private router: Router,
        private flashMessageSvc : FlashMessageService
    ) {
        if (this.isLogged())
            this.getUser().subscribe(
                user => {
                    this.user.set(user.user)
                    this.loginFront()
                },
                error => {
                    if (error.status === 401) {
                        this.logoutFront()
                    }
                }
            );

    }

    private path = environment.baseUrl + 'api';

    async getCsrf() {
        return axios.get('/sanctum/csrf-cookie')
    }

    async login(credentials: Credentials): Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post<any, UserResponse>('/login', credentials)
    }

    async register(credentials: Credentials): Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post<UserResponse>('api/user', credentials)
    }


    getUser(): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.path}/user`, {withCredentials: true})
    }

    async logout(): Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post('/api/logout')
    }

    activate(code: string): Observable<any> {
        return this.http.post<any>(`${this.path}/activate`, {'join_code': code}, {withCredentials: true})
    }


    logoutFront() {
        this.user.set(null)
        this.isLogged.set(false)
        localStorage.removeItem('isLogged')
        this.flashMessageSvc.messages().push({
            message : 'Sesion cerrada',
            type : 'message',
            duration : 5
        })
        this.router.navigate(['/login'])
    }

    loginFront() {
        this.isLogged.set(true)
        localStorage.setItem('isLogged', 'true')
        this.router.navigate(['/'])
    }

    serverErrorMessage : FlashMessage = {
        message: 'Estamos teniendo problemas con el servidor, pruebe a recargar la pagina o conectese de nuevo mas tarde',
        type: 'error',
        duration : 20
    }

}


