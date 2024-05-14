import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Link } from '../../models/properties/link';
import { Observable } from 'rxjs/internal/Observable';
import { LinkComponent } from '../../resources/link/link.component';
import { YoutubeVideoComponent } from '../../posts/youtube-video/youtube-video.component';
import { ValidationsService } from '../validations.service';
import { PostComponent } from '../../posts/post/post.component';

@Injectable({
	providedIn: 'root'
})
export class LinkService {

	private path = `http://localhost:8000/api/`

	constructor(private http: HttpClient, private validator: ValidationsService) { }

	postLink(from: string, id: string, links: Link[]): Observable<Link[]> {
		return this.http.post<Link[]>(`${this.path}${from}/${id}/link`, { links: links }, { withCredentials: true })
	}

	deleteLink(from: string, id: string): Observable<any> {
		return this.http.delete(`${this.path}${from}/link/${id}`, { withCredentials: true })
	}

	destroyLink(LinkComponent: LinkComponent | YoutubeVideoComponent) {
		LinkComponent.isLoadingDelete.set(true)
		this.deleteLink('post', LinkComponent.link()?.id ?? '').subscribe(
			res => {
				LinkComponent.isLoadingDelete.set(false)
				LinkComponent.delete.emit({
					id: LinkComponent.link()?.id ?? '',
					isVideo: false
				})
			},
			err => {
				LinkComponent.isLoadingDelete.set(false)
			}
		)
	}

	createLinks(from : string, fromComponent : PostComponent){
		 fromComponent.isLoadingLink = true
		this.postLink(from, fromComponent.post().id?.toString() ?? '', fromComponent.inputLinks()).subscribe(
			(res: any) => {
				const links = this.mapLinks(res.links)

				fromComponent.post().links = links.links
				fromComponent.post().videos = links.videos
				
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
