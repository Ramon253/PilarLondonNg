import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileR } from '../../models/properties/file';
import { FileComponent } from '../../resources/file/file.component';
import { MultimediaComponent } from '../../multimedia/multimedia.component';
import { ValidationsService } from '../validations.service';
import { PostCardComponent } from '../../posts/post-card/post-card.component';
import { PostComponent } from '../../posts/post/post.component';
import { FormPostComponent } from '../../resources/form-post/form-post.component';
import {AssignmentComponent} from "../../assignments/assignment/assignment.component";
import {Post} from "../../models/post";
import {Assignment} from "../../models/assignment";
import {YourSolutionComponent} from "../../solution/your-solution/your-solution.component";
import {Solution} from "../../models/solution";

@Injectable({
	providedIn: 'root'
})
export class FileService {

	private path = `http://localhost:8000/api/`

	constructor(private http: HttpClient, private validator: ValidationsService) { }

	postFile(from: string, id: string, files: FormData): Observable<FileR[]> {
		return this.http.post<FileR[]>(`${this.path}${from}/${id}/file`, files, { withCredentials: true })
	}


	deleteFile(from: string, id: string): Observable<any> {
		return this.http.delete(`${this.path}${from}/file/${id}`, { withCredentials: true })
	}


	destroyFile(from : string , file: FileComponent | MultimediaComponent) {
		file.isLoadingDelete.set(true)
		this.deleteFile(from, file.file()?.id.toString() ?? '').subscribe(
			res => {
				file.delete.emit({ id: file.file()?.id.toString() ?? '', isMultimedia: false })
				file.isLoadingDelete.set(false)
			},
			err => {
				file.isLoadingDelete.set(false)
			}
		)
	}


	createFiles(from: string, fromComponent: PostComponent | AssignmentComponent | YourSolutionComponent, post : Post|Assignment |Solution) {

		fromComponent.isLoadingFile = true
		const formData = new FormData
		for (const file of fromComponent.inputFiles()) {
			formData.append(`files[${fromComponent.inputFiles().indexOf(file)}]`, file)
		}

		this.postFile(from, post.id?.toString() ?? '', formData).subscribe(
			(res: any) => {

				const files = this.mapFiles(res.files)

				post.fileLinks = files.files
				post.multimedia = files.multimedia
				fromComponent.isLoadingFile = false
				fromComponent.inputFiles.set([])

				if (!fromComponent.isLoadingLink) {
					fromComponent.isLoadingPostResource.set(false)
					fromComponent.showPostDialog.set(false)
				}


			}
		)
	}

	mapFiles(files: FileR[]): {files : FileR[], multimedia: FileR[]} {
        let multimedia: FileR[] = []
		files = files.filter((fileLink: FileR) => {
			if (!this.validator.checkFile(fileLink.mime_type)) {
				return true
			}
			multimedia.push(fileLink)
			return false
		})
		return { files : files, multimedia: multimedia }
	}

}
