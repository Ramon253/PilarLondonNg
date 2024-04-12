import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { Credentials } from './models/credentials';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }

  getCsrf():Observable<any>{
    return this.http.get('http://localhost:8000/sanctum/csrf-cookie',{withCredentials: true})
  }

  login(credentials : Credentials): Observable<any>{
    return this.http.post<any>('http://localhost:8000/api/login', credentials, {withCredentials : true} ) 
  }

  getUser(): Observable<User> {
    return this.http.get<User>('http://localhost:8000/api/user', {withCredentials : true})
  }
  getFile(): Observable<any>{
    return this.http.get('https://localhost:8000/api/file');
  }
}
