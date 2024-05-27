import {Component, signal, viewChild} from '@angular/core';
import {StudentService} from "../../services/student.service";
import {LoginService} from "../../login.service";
import {DialogComponent} from "../../dialog/dialog.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";

@Component({
  selector: 'app-create-student-form',
  standalone: true,
    imports: [
        DialogComponent,
        LoadingWheelComponent,
        FormsModule,
        ReactiveFormsModule,
        ValidationErrorComponent
    ],
  templateUrl: './create-student-form.component.html',
  styles: ``
})
export class CreateStudentFormComponent {

    isLoading = signal<boolean>(true)
    showActivateDialog = signal<boolean>(false)
    isLoadingCode = signal<boolean>(false)

    createForm = this.formBuilder.group({
        full_name : ['', Validators.required],
        surname : ['', Validators.required],
        level : ['', Validators.required],
        phone_number : ['', Validators.pattern('^(?:(?:\\+34|0034)?\\s?(?:6\\d|7[1-9]|9[1-9]|8[1-9])\\d{7})$\n')],
        birth_date : ['', Validators.required],
        parent: []
    })
    constructor(
        private studentSvc : StudentService,
        public loginSvc : LoginService,
        private formBuilder : FormBuilder
    ) {
    }

    activate(codeInput : HTMLInputElement){
        this.isLoadingCode.set(true)
        this.studentSvc.activate(codeInput.value).then(
            res => {
                this.isLoading.set(false)
                this.showActivateDialog.set(false)
            }
        )
    }

    ngOnInit(){
        this.studentSvc.isActivated().then(
            res => {
             this.isLoading.set(false)
            }
        ).catch(
            err => {
                this.showActivateDialog.set(true)
            }
        )
    }
}
