import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileR } from '../../models/properties/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private path = `http://localhost:8000/api/`

  constructor(private http: HttpClient) { }

  postFile(from: string, id: string, files : FormData): Observable<FileR[]> {
    return this.http.post<FileR[]>(`${this.path}${from}/${id}/file`, files , { withCredentials: true })
  }

  deleteFile(from: string, id: string): Observable<any> {
    return this.http.delete(`${this.path}${from}/file/${id}`, { withCredentials: true })
  }

}
