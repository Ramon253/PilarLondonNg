import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from './models/user/userResponse';
import { Credentials } from './models/credentials';
import { User } from './models/user/user';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    isLogged = signal<boolean>(false)
    User = signal<User | null>(null)
    constructor(private http: HttpClient) {

        this.getUser().subscribe(user => {
            if (user.error) {
                this.isLogged.set(false)
                return
            }
            this.User.set(user as User)
            this.isLogged.set(true)
        })
    }

    private path = 'http://localhost:8000/api';
    private csrfPath = `http://localhost:8000/sanctum/csrf-cookie`

    getCsrf(): Observable<any> {
        return this.http.get(this.csrfPath, { withCredentials: true })
    }

    login(credentials: Credentials): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.path}/login`, credentials, { withCredentials: true })
    }

    register(credentials: Credentials): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.path}/user`, credentials, { withCredentials: true })
    }

    getUser(): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.path}/user`, { withCredentials: true })
    }

    logout(): Observable<any> {
        return this.http.post<any>(`${this.path}/logout`, { withCredential: true })
    }

    activate(code: string): Observable<any> {
        return this.http.post<any>(`${this.path}/activate`, { 'join_code': code }, { withCredentials: true })
    }

}


