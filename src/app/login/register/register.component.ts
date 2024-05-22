import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../login.service';
import { filter, min } from 'rxjs';
import { Credentials } from '../../models/credentials';
import { ValidationsService } from '../../services/validations.service';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './register.component.html',
	styles: ``
})
export class RegisterComponent {

	public registerForm = this.formBuilder.group({
		name: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).+$/), Validators.minLength(10)]],
		password_confirmation: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).+$/), Validators.minLength(10)]]
	})



	constructor(private loginSvc: LoginService, private formBuilder: FormBuilder, public validator: ValidationsService) { }


	hasErrors(field: string) {
		return !this.registerForm.get(field)?.valid && this.registerForm.get(field)?.touched;
	}


	register(ev: SubmitEvent) {
		ev.preventDefault();

		let credential = this.registerForm.getRawValue()

		this.loginSvc.register(credential as Credentials).then(res => {
			console.log(res);
		});

	}
}
