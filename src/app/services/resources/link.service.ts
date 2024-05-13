import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Link } from '../../models/properties/link';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  private path = `http://localhost:8000/api/`

  constructor(private http: HttpClient) { }

  postLink(from: string, id: string, links: Link[]): Observable<Link[]> {
    return this.http.post<Link[]>(`${this.path}${from}/${id}/link`, { links: links }, { withCredentials: true })
  }

  deleteLink(from: string, id: string): Observable<any> {
    return this.http.delete(`${this.path}${from}/link/${id}`, { withCredentials: true })
  }
}
