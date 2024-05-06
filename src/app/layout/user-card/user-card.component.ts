import { Component } from '@angular/core';
import {LoginService} from "../../login.service";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Router} from "@angular/router";

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
    constructor(private loginSvc : LoginService , private router : Router ) {
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
}
