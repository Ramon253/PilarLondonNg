import {
    Component,
    EventEmitter,
    HostBinding,
    Output,
    signal,
    NgModule,
    viewChild,
    ElementRef,
    ViewChildren, QueryList, Renderer2
} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, Routes} from "@angular/router";
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
import {environment} from "../../../environments/environment.development";

@Component({
	selector: 'app-navbar',
	standalone: true,
    imports: [RouterLink, RouterLinkActive, NgOptimizedImage, UserCardComponent, FooterComponent, FlashMessageComponent],
	templateUrl: './navbar.component.html',
	styles: `
        .icon{
            @apply w-full rounded-sm h-[2px] bg-main transition duration-300 ease-in-out
        }

        .secondCross{
            @apply absolute top-2.5 left-2.5 w-[30px] rotate-45
        }
        .firstCross{
            @apply absolute bottom-2.5 left-2.5 w-[30px] -rotate-45
        }
    `
})
export class NavbarComponent {
    @ViewChildren('menu') menuElements! : QueryList<ElementRef>
    toggleMenu(...elements : Array<HTMLDivElement>){
        this.navMenuOpen.set(!this.navMenuOpen())
        this.menuElements.first.nativeElement.classList.toggle('firstCross')
        this.menuElements.get(1)!.nativeElement.classList.toggle('translate-x-[130%]')
        this.menuElements.last.nativeElement.classList.toggle('secondCross')
    }
    navMenuOpen = signal<boolean>(false)
    showUserMenu = signal<boolean>(false)
	isLogged = this.loginSvc.isLogged
	user = this.loginSvc.user
	DarkMode = signal<boolean>(JSON.parse(window.localStorage.getItem('darkMode') ?? 'false'))
    nav = viewChild<ElementRef>('nav')
    mobileRouteMark = viewChild<ElementRef>('mobileRouteMark')

	@Output('darkMode') darkMode = new EventEmitter<boolean>(this.DarkMode())

	constructor(
        public loginSvc: LoginService,
        public fleshMessageSvc : FlashMessageService,
        public router : Router,
        private scrollSvc :  ScrollService,
        private renderer : Renderer2
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

        if (this.router.url.includes('group')){
            this.renderer.setStyle(this.mobileRouteMark()?.nativeElement, 'transform', `translateY(0)`)
        } else if (this.router.url.includes('post')) {
            this.renderer.setStyle(this.mobileRouteMark()?.nativeElement, 'transform', `translateY(130%)`)
        } else
            this.renderer.setStyle(this.mobileRouteMark()?.nativeElement, 'transform', `translateY(-130%)`)
        this.router.events.subscribe(event => {
/*            if (event instanceof NavigationEnd) {
                if (this.navMenuOpen()) {
                    this.toggleMenu()
                }
            }*/
            this.mobileRouteMark()?.nativeElement.classList.remove('hidden');
            if (this.router.url.includes('group')){
                this.renderer.setStyle(this.mobileRouteMark()?.nativeElement, 'transform', `translateY(0)`)
            } else if (this.router.url.includes('post')) {
                this.renderer.setStyle(this.mobileRouteMark()?.nativeElement, 'transform', `translateY(130%)`)
            }else
                this.mobileRouteMark()?.nativeElement.classList.add('hidden');
        })
    }
    navigateTo(url : string){
        this.router.navigate([url]).then(result => {
            setTimeout(
                () => {
                    this.toggleMenu()
                }, 300
            )
        })
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
    unToggleMenu(){
        this.toggleMenu()
    }

    protected readonly environment = environment;
}
