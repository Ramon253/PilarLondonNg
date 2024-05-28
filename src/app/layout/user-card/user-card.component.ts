import {Component, input, signal} from '@angular/core';
import {LoginService} from "../../login.service";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-user-card',
  standalone: true,
    imports: [
        NgOptimizedImage, RouterLink
    ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
    user = this.loginSvc.user
    classList = input<string>()
    showMenu = signal<boolean>(false)
    constructor(public loginSvc : LoginService , private router : Router ) {
    }

    showOptions(options :HTMLDivElement){
        options.classList.toggle('-bottom-16')
    }

    logout(){
        this.loginSvc.logout().subscribe(
            res => {
                this.loginSvc.isLogged.set(false)
                localStorage.removeItem('isLogged')
                this.loginSvc.user.set(null)
                this.router.navigate(['/'])
            }
        )
    }

    protected readonly environment = environment;
}
