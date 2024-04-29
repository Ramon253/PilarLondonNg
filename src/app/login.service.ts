import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserResponse} from './models/user/userResponse';
import {Credentials} from './models/credentials';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) {
    }

    private path = 'http://localhost:8000/api';
    private csrfPath = `http://localhost:8000/sanctum/csrf-cookie`

    getCsrf(): Observable<any> {
        return this.http.get(this.csrfPath, {withCredentials: true})
    }

    login(credentials: Credentials): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.path}/login`, credentials, {withCredentials: true})
    }

    getUser(): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.path}/user`, {withCredentials: true})
    }

    logout(): Observable<any> {
        return this.http.post<any>(`${this.path}/logout`, {withCredential: true})
    }

    activate(code: string): Observable<any> {
        return this.http.post<any>(`${this.path}/activate`, {'join_code' : code}, {withCredentials: true})
    }

}


