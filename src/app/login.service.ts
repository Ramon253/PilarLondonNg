import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from './models/user/user';
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

}
