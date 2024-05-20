import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Group} from "../models/group";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
      private http: HttpClient,
  ) { }

    getGroups():Observable<Group[]>{
      return this.http.get<Group[]>('http://localhost:8000/api/groups', {withCredentials: true})
    }
}
