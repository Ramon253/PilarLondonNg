import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';
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
import {environment} from "../../../environments/environment.development";
import axios from "axios";

axios.defaults.baseURL = environment.baseUrl;
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

@Injectable({
	providedIn: 'root'
})
export class FileService {

	private path = `${environment.baseUrl}api/`

	constructor(private http: HttpClient, private validator: ValidationsService) { }


	async postFile(from: string, id: string, files: FormData): Promise<FileR[] | any > {
        await axios.get('/sanctum/csrf-cookie')
		return axios.post<FileR[]>(`/api/${from}/${id}/file`, files)
	}


	async deleteFile(from: string, id: string): Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
		return axios.delete(`/api/${from}/file/${id}`)
	}


	destroyFile(from : string , file: FileComponent | MultimediaComponent) {
		file.isLoadingDelete.set(true)
		this.deleteFile(from, file.file()?.id.toString() ?? '').then(
			res => {
				file.delete.emit({ id: file.file()?.id.toString() ?? '', isMultimedia: false })
				file.isLoadingDelete.set(false)
			},
			err => {
				file.isLoadingDelete.set(false)
			}
		)
	}

    downLoadFile(url : string){
        return this.http.get(url, { withCredentials: true , responseType: 'blob' })
    }


	createFiles(from: string, fromComponent: PostComponent | AssignmentComponent | YourSolutionComponent, post : Post|Assignment |Solution) {

		fromComponent.isLoadingFile = true
		const formData = new FormData
		for (const file of fromComponent.inputFiles()) {
			formData.append(`files[${fromComponent.inputFiles().indexOf(file)}]`, file)
		}

		this.postFile(from, post.id?.toString() ?? '', formData).then(
			(res: any) => {

				const files = this.mapFiles(res.data.files)

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
