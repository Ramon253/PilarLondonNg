import { Component, EventEmitter, HostBinding, Output, signal, NgModule, viewChild, ElementRef } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, Routes} from "@angular/router";
import { LoginService } from '../../login.service';
import { User } from '../../models/user/user';
import {NgOptimizedImage} from "@angular/common";
import {UserCardComponent} from "../user-card/user-card.component";
import {FooterComponent} from "../footer/footer.component";
import {FlashMessageService} from "../../services/flash-message.service";
import {FlashMessageComponent} from "../../resources/flash-message/flash-message.component";
import {FlashMessage} from "../../models/flash-message";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {ScrollService} from "../../services/scroll.service";

@Component({
	selector: 'app-navbar',
	standalone: true,
    imports: [RouterLink, RouterLinkActive, NgOptimizedImage, UserCardComponent, FooterComponent, FlashMessageComponent],
	templateUrl: './navbar.component.html',
	styles: ``
})
export class NavbarComponent {
	isLogged = this.loginSvc.isLogged
	user = this.loginSvc.user
	DarkMode = signal<boolean>(JSON.parse(window.localStorage.getItem('darkMode') ?? 'false'))
    nav = viewChild<ElementRef>('nav')

	@Output('darkMode') darkMode = new EventEmitter<boolean>(this.DarkMode())

	constructor(
        public loginSvc: LoginService,
        public fleshMessageSvc : FlashMessageService,
        public router : Router,
        private scrollSvc :  ScrollService
    ) {
		if (this.user() === null &&  this.isLogged()){
			this.loginSvc.getUser().subscribe(
				user => {
					this.loginSvc.user.set(user.user as User)
			},
                error => {
                    this.loginSvc.isLogged.set(false)
                    localStorage.removeItem('isLogged')
                })
		}
	}
    ngOnInit(){
        if (this.router.url !== '/'){
            this.nav()?.nativeElement.classList.add('shadow');
        }
    }
	toggleDarkMode(button: HTMLButtonElement) {
		this.DarkMode.set(!this.DarkMode())
		this.darkMode.emit(this.DarkMode())
		button.classList.toggle('rotate-[360deg]')
		window.localStorage.setItem('darkMode', JSON.stringify(this.DarkMode()))
	}


    scrollEvent(event : any){
        this.scrollSvc.scrollTop.emit(event.target.scrollTop);

        if(event.target.scrollTop > 2)
            this.nav()?.nativeElement.classList.add('shadow');
        else if(event.target.scrollTop > 0)
            this.nav()?.nativeElement.classList.remove('shadow');
    }

}
