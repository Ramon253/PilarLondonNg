import { Component, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [],
    templateUrl: './login.component.html',
    styles: ``,
})
export class LoginComponent {
    constructor(private loginSvc: LoginService) {}
    login(
        name: HTMLInputElement,
        password: HTMLInputElement,
        event: SubmitEvent
    ) {
        event.preventDefault();
        this.loginSvc.getCsrf().subscribe((res) => {

            this.loginSvc
                .login({
                    name: name.value,
                    password: password.value
                })
                .subscribe((user) => {
                    console.log(user.success);
                });
        });
    }

    getUser() {
        this.loginSvc.getUser().subscribe((user) => console.log(user));
    }
}
