import { Component, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styles: ``,
})
export class LoginComponent {
    constructor(private loginSvc: LoginService) {}

    private form = new FormControl('name')
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
