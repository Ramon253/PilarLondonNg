import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Link } from '../../models/properties/link';
import { Observable } from 'rxjs/internal/Observable';
import { LinkComponent } from '../../resources/link/link.component';
import { YoutubeVideoComponent } from '../../posts/youtube-video/youtube-video.component';
import { ValidationsService } from '../validations.service';
import { PostComponent } from '../../posts/post/post.component';
import {AssignmentComponent} from "../../assignments/assignment/assignment.component";
import {Post} from "../../models/post";
import {Assignment} from "../../models/assignment";
import {YourSolutionComponent} from "../../solution/your-solution/your-solution.component";
import {Solution} from "../../models/solution";
import {environment} from "../../../environments/environment.development";
import axios from "axios";

axios.defaults.baseURL = environment.baseUrl
axios.defaults.withXSRFToken = true
axios.defaults.withCredentials = true

@Injectable({
	providedIn: 'root'
})
export class LinkService {

	private path = environment.baseUrl + `api/`

	constructor(private http: HttpClient, private validator: ValidationsService) { }

	async postLink(from: string, id: string, links: Link[]): Promise<Link[] | any> {
        await axios.get('/sanctum/csrf-cookie')
		return axios.post<Link[]>(`/api/${from}/${id}/link`, { links: links })
	}

	async deleteLink(from: string, id: string): Promise<any> {
        await axios.get('/sanctum/csrf-cookie')
		return this.http.delete(`/api/${from}/link/${id}`)
	}

	destroyLink(from : string , LinkComponent: LinkComponent | YoutubeVideoComponent ) {
		LinkComponent.isLoadingDelete.set(true)

		this.deleteLink(from, LinkComponent.link()?.id ?? '').then(
			res => {
				LinkComponent.isLoadingDelete.set(false)
				LinkComponent.delete.emit({
					id: LinkComponent.link()?.id ?? '',
					isVideo: LinkComponent.constructor.name === 'YoutubeVideoComponent',
				})
			},
			err => {
				LinkComponent.isLoadingDelete.set(false)
			}
		)
	}

	createLinks(from : string, fromComponent : PostComponent | AssignmentComponent | YourSolutionComponent, post : Post| Assignment | Solution){
		 fromComponent.isLoadingLink = true
		this.postLink(from, post.id?.toString() ?? '', fromComponent.inputLinks()).then(
			(res: any) => {
				const links = this.mapLinks(res.data.links)

				post.links = links.links
				post.videos = links.videos

				fromComponent.isLoadingLink = false
				fromComponent.inputLinks.set([])

				if (!fromComponent.isLoadingFile) {
					fromComponent.isLoadingPostResource.set(false)
					fromComponent.showPostDialog.set(false)
				}
			}
		)
	}

	mapLinks(links: Link[]) {
		let videos: Link[] = []

		links = links.filter((link: Link) => {
			if (!this.validator.checkLink(link.link)) {
				return true
			}
			videos.push(link)
			return false
		})

		return {
			links : links,
			videos : videos
		}
	}
}
