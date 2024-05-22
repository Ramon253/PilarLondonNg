import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from './models/user/userResponse';
import { Credentials } from './models/credentials';
import { User } from './models/user/user';
import axios, { AxiosResponse } from 'axios';
import {environment} from "../environments/environment.development";

axios.defaults.withCredentials = true
axios.defaults.baseURL = environment.baseUrl
axios.defaults.withXSRFToken = true;



@Injectable({
    providedIn: 'root'
})
export class LoginService {
    public isLogged = signal<boolean>(JSON.parse(localStorage.getItem('isLogged') ?? 'false'))
    user = signal<User | null>(null)

    constructor(private http: HttpClient) {
        this.getUser().subscribe(
            user => {
                this.isLogged.set(true)
                this.user.set(user.user)
                localStorage.setItem('isLogged', 'true')
            },
            error => {
                if (error.status === 401) {
                    this.logoutFront()
                }
            }
        );

    }

    private path =  environment.baseUrl + 'api';

    async login(credentials: Credentials): Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post<any, UserResponse>('/login', credentials)
    }

    async register(credentials: Credentials): Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
        return axios.post<UserResponse>('api/user', credentials)
    }

    getUser(): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.path}/user`, { withCredentials: true })
    }

    logout(): Observable<any> {
        return this.http.post<any>(`${this.path}/logout`, { withCredentials: true })
    }

    activate(code: string): Observable<any> {
        return this.http.post<any>(`${this.path}/activate`, { 'join_code': code }, { withCredentials: true })
    }


    logoutFront() {
        this.user.set(null)
        this.isLogged.set(false)
        localStorage.removeItem('isLogged')
    }

}


