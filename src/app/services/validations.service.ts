import { Injectable } from '@angular/core';
import {FormGroup, isFormGroup} from '@angular/forms';
import {find} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ValidationsService {

    constructor() { }

    private errors: { [key: string]: string } = {
        'required': 'El campo @field es obligatorio',
        'email': 'El campo email debe ser un email valido',
        'pattern': 'El campo @field debe tener al menos un numero y un simbolo',
        'minlength': 'El campo @field debe tener un minimo de @length caracteres',
        'invalidCredentials' : 'Credenciales invalidas',
        'taken': 'El campo @field ya esta en uso',
        'phone' : 'El telefono debe ser valido',
        'notConfirmed' : 'La contraseña de confirmacion no coincide'
    }


    getErrors(field: string, errors: string[], form: FormGroup): string {
        for (const error of errors) {
            let input = form.get(field)
            let minLength;

            if (!input?.hasError(error))
                continue

            if (input?.errors && input.errors['minlength']) {
                minLength = input.errors['minlength']['requiredLength']
            }
            return this.errors[error].replace('@field', field).replace('@length', minLength)
        }

        return ''
    }
    checkPhoneNumber(phone: HTMLInputElement, form : FormGroup) {
        let value = phone.value.replaceAll(' ', '');
        if (value.length === 0){
            form.get('phone')?.enable()
            return;
        }
        if (value.length !== 9) {
            form.get('phone')?.setErrors({phone : true});
            return
        }
    }

    public checkLink(url: string): boolean {
        return url.includes('youtube') || url.includes('yout') || url.includes('drive.google.com');
    }
    public checkFile(mimeType : string) : boolean {
        return mimeType.includes('video') || mimeType.includes('image')
    }
}
