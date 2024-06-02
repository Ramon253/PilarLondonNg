import {Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationsService} from '../../services/validations.service';

@Component({
    selector: 'app-validation-error',
    standalone: true,
    imports: [],
    templateUrl: './validation-error.component.html',
    styleUrl: './validation-error.component.css'
})
export class ValidationErrorComponent {
    form = input.required<FormGroup>()
    field = input<string>('')
    errors = input<string[]>([])
    showError = input<boolean>(false)
    input = input<HTMLInputElement | HTMLTextAreaElement>()
    hasError= output<boolean>()

    hasErrors(): boolean {
        if (this.showError()) return true
        let hasError =(!this.form().get(this.field())?.valid && this.form().get(this.field())?.touched) ?? false
        if (hasError) {
            this.input()?.classList.replace('border-secondary-grey', 'border-secondary')
            this.input()?.classList.replace('border-main', 'border-secondary')
            this.hasError.emit(true)
        } else
            this.input()?.classList.replace( 'border-secondary', 'border-main')
        return hasError
    }

    constructor(
        public validator: ValidationsService
    ) {
    }
}
