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

	deleteLink()  {
		this.linkSvc.destroyLink(this as LinkComponent)
	}


	disableLink(event: Event) {
		if (this.hoverCloseButton())
			event.preventDefault()
	}
}
