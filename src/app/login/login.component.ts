import {Component, effect, ElementRef, signal, viewChild} from '@angular/core';
import {LoginService} from '../login.service';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Credentials} from '../models/credentials';
import {ValidationsService} from '../services/validations.service';
import {Router, RouterLink} from '@angular/router';
import {ValidationErrorComponent} from '../validations/validation-error/validation-error.component';
import {FlashMessageService} from "../services/flash-message.service";
import {RoutingService} from "../services/routing.service";
import {LoadingWheelComponent} from "../svg/loading-wheel/loading-wheel.component";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule, RouterLink, ValidationErrorComponent, LoadingWheelComponent
    ],
    templateUrl: './login.component.html',
    styles: ``,
})
export class LoginComponent {
    arrowIcon = viewChild<ElementRef>('arrowIcon');
    identifier = signal<string>('email')
    fields = ['name', 'email', 'password']
    isLoading = signal<boolean>(false)

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
        private flashMessageSvc: FlashMessageService,
        public routingSvc: RoutingService
    ) {
        effect(this.requireId);
    }


    login(event: SubmitEvent) {

        event.preventDefault();
        this.isLoading.set(true)
        this.loginSvc.login(this.loginForm.getRawValue() as Credentials).then(
            res => {
                this.loginSvc.loginFront()
                this.loginSvc.user.set(res.data.user)
                this.flashMessageSvc.messages().push({
                    message: 'Logged in successfully',
                    type: 'message',
                    duration: 5
                })
                this.router.navigate([this.routingSvc.intended()]).then(
                    () => this.routingSvc.intended.set('')
                )
            }
        ).catch(
            err => {
                if (err.status === 500 || err.code === 'ERR_NETWORK') {
                    this.flashMessageSvc.messages().push(this.loginSvc.serverErrorMessage)
                    return
                }
                if (err.status === 401 || err.status === 422) {
                    this.loginForm.setErrors({invalidCredentials: true})
                    this.flashMessageSvc.messages().push({
                        message: 'Credenciales invalidas',
                        type: 'error',
                        duration: 10
                    })
                }
            }).finally(
            () => this.isLoading.set(false)
        )


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


