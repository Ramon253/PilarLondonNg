import {Component, signal, viewChild} from '@angular/core';
import {StudentService} from "../../services/student.service";
import {LoginService} from "../../login.service";
import {DialogComponent} from "../../dialog/dialog.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";
import {Student} from "../../models/student";
import {ImageCropperComponent} from "ngx-image-cropper";

@Component({
  selector: 'app-create-student-form',
  standalone: true,
    imports: [
        DialogComponent,
        LoadingWheelComponent,
        FormsModule,
        ReactiveFormsModule,
        ValidationErrorComponent,
        ImageCropperComponent
    ],
  templateUrl: './create-student-form.component.html',
  styles: ``
})
export class CreateStudentFormComponent {

    originalImage : any  = ''
    croppedImage :any   = ''

    isLoading = signal<boolean>(true)
    showActivateDialog = signal<boolean>(false)
    isLoadingCode = signal<boolean>(false)
    profilePicture = signal<File | boolean>(false)
    showCropper = signal<boolean>(false)

    createForm = this.formBuilder.group({
        full_name : ['', Validators.required],
        surname : ['', Validators.required],
        level : ['', Validators.required],
        phone_number : ['', Validators.pattern('^(?:(?:\\+34|0034)?\\s?(?:6\\d|7[1-9]|9[1-9]|8[1-9])\\d{7})$\n')],
        birth_date : [new Date(), Validators.required],
        parent: [],
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

    getProfilePic(event : any){
        if (!event.target.files.item(0)){
            return
        }
        this.showCropper.set(true)
        this.profilePicture.set(event.target.files.item(0))
        this.originalImage = event
    }
    getImage(event : any    ){
        this.croppedImage = event
    }
    createStudent(event : SubmitEvent){
        event.preventDefault()

        if (this.createForm.invalid){
            return
        }

        if (!this.profilePicture()){
            this.studentSvc.postStudent(this.createForm.getRawValue() as Student).then(
                res => {
                    this.loginSvc.user.set(res.data.user)
                    alert('user created successfully')
                }
            )
            return;
        }
        let formData = new FormData()
        this.studentSvc.postStudent(formData).then(
            res => {
                this.loginSvc.user.set(res.data.user)
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
