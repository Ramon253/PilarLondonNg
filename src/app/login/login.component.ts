import { Component, ElementRef, NgZone, contentChild, effect, signal, viewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validator, ValidatorFn, Validators } from "@angular/forms";
import { ThisReceiver, identifierName } from '@angular/compiler';
import { Credentials } from '../models/credentials';
import { ValidationsService } from '../services/validations.service';
import { Route, Router, RouterLink } from '@angular/router';
import { UserResponse } from '../models/user/userResponse';
import { ValidationErrorComponent } from '../validations/validation-error/validation-error.component';
import { User } from '../models/user/user';
import {FlashMessageService} from "../services/flash-message.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule, RouterLink, ValidationErrorComponent
    ],
    templateUrl: './login.component.html',
    styles: ``,
})
export class LoginComponent {
    arrowIcon = viewChild<ElementRef>('arrowIcon');
    identifier = signal<string>('email')
    fields = ['name', 'email', 'password']
    submitButton = viewChild<ElementRef>('submitButton')
    loadingAnimation = viewChild<ElementRef>('loadingAnimation')

    loginForm = this.formBuilder.group({
        name: [''],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [
            Validators.required,
            Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).+$/),
            Validators.minLength(10)
        ]],
        remember_me: [false]
    })


    constructor(
        private loginSvc: LoginService,
        private formBuilder: FormBuilder,
        public validator: ValidationsService,
        private router: Router,
        private flashMessageSvc : FlashMessageService
    ) {
        effect(this.requireId);
    }


    login(event: SubmitEvent) {

        event.preventDefault();

        this.submitButton()?.nativeElement.classList.toggle('hidden')
        this.loadingAnimation()?.nativeElement.classList.toggle('hidden')

        this.loginSvc.login(this.loginForm.getRawValue() as Credentials).then(
            res => {
                this.loginSvc.loginFront()
                this.loginSvc.user.set(res.data.user)
                this.flashMessageSvc.messages().push({
                    message : 'Logged in successfull',
                    type : 'message',
                    duration : 5
                })
            }

        ).catch(
            err => {
                if (err.status === 500) {
                    throw new Error()
                }
                this.loginForm.setErrors({ invalidCredentials: true })
                this.flashMessageSvc.messages().push({message : 'Credenciales invalidas', type: 'error', duration : 10})
                console.log(this.flashMessageSvc.messages())
                this.submitButton()?.nativeElement.classList.toggle('hidden')
                this.loadingAnimation()?.nativeElement.classList.toggle('hidden')
            })


    }

    hasErrors(field: string) {
        return !this.loginForm.get(field)?.valid && this.loginForm.get(field)?.touched;
    }
    changeIdentifier() {
        this.identifier.set(this.identifier() === 'name' ? 'email' : 'name')
        this.arrowIcon()?.nativeElement.classList.toggle('rotate-[180deg]')
    }

    requireId = () => {

        this.loginForm.get(this.identifier())?.setValidators(Validators.required)

        if (this.identifier() === 'email')
            this.loginForm.get('email')?.setValidators(Validators.email)

        this.loginForm.get(this.identifier())?.updateValueAndValidity();
        console.log('Form after ->' + this.identifier());
        console.log(this.loginForm);

        let before = this.identifier() === 'name' ? 'email' : 'name'

        console.log(before);
        console.log(this.loginForm.get(before));


        this.loginForm.get(before)?.removeValidators(Validators.required);
        this.loginForm.get(before)?.updateValueAndValidity();
        this.loginForm.get(before)?.setValue('')
        console.log('form al final');
        console.log(this.loginForm);
    }
}


