import {Component, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from '../../login.service';
import {Credentials} from '../../models/credentials';
import {ValidationsService} from '../../services/validations.service';
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";
import {Router, RouterLink} from "@angular/router";
import {RoutingService} from "../../services/routing.service";
import {FlashMessageService} from "../../services/flash-message.service";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, ValidationErrorComponent, LoadingWheelComponent, RouterLink],
    templateUrl: './register.component.html',
    styles: ``
})
export class RegisterComponent {
    isLoading = signal<boolean>(false)

    public registerForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).+$/), Validators.minLength(10)]],
        password_confirmation: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).+$/), Validators.minLength(10)]]
    })


    constructor(
        private loginSvc: LoginService,
        private formBuilder: FormBuilder,
        public validator: ValidationsService,
        private router: Router,
        private routingSvc: RoutingService,
        private flashMessageSvc : FlashMessageService
    ) {
    }


    hasErrors(field: string) {
        return !this.registerForm.get(field)?.valid && this.registerForm.get(field)?.touched;
    }


    register(ev: SubmitEvent) {
        ev.preventDefault();
        this.isLoading.set(true)

        let credential = this.registerForm.getRawValue()
        this.loginSvc.register(credential as Credentials).then(res => {
            this.loginSvc.loginFront()
            this.loginSvc.user.set(res.data.user)
            this.flashMessageSvc.messages().push({
                message : 'Usuario creado con exito, si eres estudiante y quieres activar tu cuenta haz click aqui',
                type : 'message',
                duration : 20,
                link : 'create-student'
            })
            this.router.navigate([this.routingSvc.intended()]).then(() => this.routingSvc.intended.set(''))
        }).catch((err) => {
            if (err.status === 500 || err.code === 'ERR_NETWORK') {
                this.flashMessageSvc.messages().push(this.loginSvc.serverErrorMessage)
                return
            }

            if (err.response.status === 422){
                const errors = err.response.data.errors
                console.log(err.response.data.errors)
                if (errors.name) {
                    this.registerForm.get('name')?.setErrors({taken : true})
                }
                if (errors.email) {
                    this.registerForm.get('email')?.setErrors({taken : true})
                }
                if (errors.password) {
                    this.registerForm.get('password')?.setErrors({notConfirmed : true})
                }
            }

        }).finally(
            () => this.isLoading.set(false)
        );

    }
}
