import { Component, ElementRef, contentChild, effect, signal, viewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validator, ValidatorFn, Validators } from "@angular/forms";
import { ThisReceiver, identifierName } from '@angular/compiler';
import { Credentials } from '../models/credentials';
import { ValidationsService } from '../services/validations.service';
import { Route, Router } from '@angular/router';

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
    submitButton = viewChild<ElementRef>('submitButton')
    loadingAnimation = viewChild<ElementRef>('loadingAnimation')

    loginForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [
            Validators.required,
            Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).+$/),
            Validators.minLength(10)
        ]]
    })

    constructor(
        private loginSvc: LoginService,
        private formBuilder: FormBuilder,
        public validator: ValidationsService,
        private router : Router
    ) { }



    async login(event: SubmitEvent) {
        event.preventDefault();

        this.submitButton()?.nativeElement.classList.toggle('hidden')
        this.loadingAnimation()?.nativeElement.classList.toggle('hidden')

        let res = await this.loginSvc.getCsrf()

        this.loginSvc
            .login(this.loginForm.getRawValue() as Credentials)
            .subscribe((user) => {
                if (user.error){

                    this.loginForm.get('name')?.setErrors({invalidCredentials : true})
                    this.loginForm.get('password')?.setErrors({invalidCredentials : true})
                    this.loginForm.get('email')?.setErrors({invalidCredentials : true})

                    this.submitButton()?.nativeElement.classList.toggle('hidden')
                    this.loadingAnimation()?.nativeElement.classList.toggle('hidden')

                    return
                }

                this.loginSvc.putLogin(true)
                this.router.navigate(['/posts']);
            })
    }

    getUser() {
        this.loginSvc.getUser().subscribe((user) => console.log(user));
    }

    hasErrors(field: string) {
        return !this.loginForm.get(field)?.valid && this.loginForm.get(field)?.touched;
    }

}
