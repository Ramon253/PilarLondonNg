import { Component, input, output, signal } from '@angular/core';
import { Link } from '../../models/properties/link';
import { LoginService } from '../../login.service';
import { LoadingWheelComponent } from '../../svg/loading-wheel/loading-wheel.component';
import { LinkService } from '../../services/resources/link.service';

@Component({
	selector: 'app-link',
	standalone: true,
	imports: [LoadingWheelComponent],
	templateUrl: './link.component.html',
	styleUrl: './link.component.css'
})
export class LinkComponent {
	hoverCloseButton = signal<boolean>(false)
	link = input<Link>()
	delete = output<{ id: string, isVideo: boolean }>()
	isLoadingDelete = signal<boolean>(false)


	constructor(
		public loginSvc: LoginService,
		private linkSvc: LinkService
	) { }

	deleteLink() {
		this.isLoadingDelete.set(true)
		this.linkSvc.deleteLink('post', this.link()?.id ?? '').subscribe(
			res => {
				this.isLoadingDelete.set(false)
				this.delete.emit({
					id : this.link()?.id ?? '',
					isVideo : false
				})
			},
			err => {
				this.isLoadingDelete.set(false)
			}
		)
	}

	disableLink(event: Event) {
		if (this.hoverCloseButton())
			event.preventDefault()
	}
}
