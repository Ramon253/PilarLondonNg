import {Component, signal} from '@angular/core';
import {StudentService} from "../../services/student.service";
import {LoginService} from "../../login.service";
import {DialogComponent} from "../../dialog/dialog.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";
import {Student} from "../../models/student";
import {ImageCropperComponent} from "ngx-image-cropper";
import {Router} from "@angular/router";
import {RoutingService} from "../../services/routing.service";
import {FlashMessageService} from "../../services/flash-message.service";

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

    originalImage: any = ''
    croppedImage: any = ''

    isLoading = signal<boolean>(true)
    isLoadingPost = signal<boolean>(false)
    isLoadingCode = signal<boolean>(false)
    showActivateDialog = signal<boolean>(false)
    profilePicture = signal<File | boolean>(false)
    showCropper = signal<boolean>(false)
    showVerifyEmail = signal<boolean>(false)
    isLoadingVerify = signal(false)

    createForm = this.formBuilder.group({
        full_name: ['', Validators.required],
        surname: ['', Validators.required],
        level: ['', Validators.required],
        phone_number: ['', Validators.minLength(9)],
        birth_date: [new Date(), Validators.required],
        parent: [],
    })

    constructor(
        private studentSvc: StudentService,
        public loginSvc: LoginService,
        private formBuilder: FormBuilder,
        private router: Router,
        private routingSvc: RoutingService,
        private flashMessageSvc: FlashMessageService
    ) {
    }

    activate(codeInput: HTMLInputElement) {
        this.isLoadingCode.set(true)
        this.studentSvc.activate(codeInput.value).then(
            res => {
                this.isLoading.set(false)
                this.showActivateDialog.set(false)
            }
        )
    }

    getProfilePic(event: any) {
        if (!event.target.files.item(0)) {
            return
        }
        this.showCropper.set(true)
        this.profilePicture.set(event.target.files.item(0))
        this.originalImage = event
    }

    getImage(event: any) {
        this.croppedImage = event
    }

    createStudent(event: SubmitEvent) {
        event.preventDefault()

        if (this.createForm.invalid) {
            return
        }
        let student = this.createForm.getRawValue() as Student

        this.isLoadingPost.set(true)
        if (!this.profilePicture()) {
            this.studentSvc.postStudent(student).then(
                res => {
                    this.isLoadingPost.set(false)
                    let user = res.data.user
                    user.role = 'student'
                    this.loginSvc.user.set(user)
                    this.router.navigate(['/'])
                }
            )
            return;
        }
        let formData = new FormData()
        formData.append('full_name', student.full_name ?? '')
        formData.append('surname', student.surname ?? '')
        formData.append('birth_date', student.birth_date?.toString() ?? '')
        formData.append('phone_number', student.phone_number ?? '')
        formData.append('level', student.level ?? '')
        formData.append('profile_photo', this.profilePicture() as File)

        this.studentSvc.postStudent(formData).then(
            res => {
                let user = res.data.user
                user.role = 'student'
                this.loginSvc.user.set(user)
                this.isLoadingPost.set(false)
                this.router.navigate(['/'])
            }
        )
    }

    verifyEmail(codeInput: HTMLInputElement) {
        this.isLoadingVerify.set(true)
        this.studentSvc.verify(codeInput.value).then(
            res => {
                this.isLoading.set(false)
                this.showVerifyEmail.set(false)
                this.showActivateDialog.set(false)
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
        )
    }

    ngOnInit() {
        if (!this.loginSvc.isLogged()) {
            this.routingSvc.intended.set('create-student')
            this.router.navigate(['/login']).then(() => {
                this.flashMessageSvc.messages().push({
                    message: 'Necesitas iniciar sesion para poder activar tu cuenta, si no tiene cuenta creese una aqui',
                    type: 'error',
                    duration: 20,
                    link: 'register'
                })
            })
            return
        }
        this.loginSvc.isVerified().then(() => {
            this.studentSvc.isActivated().then(
                res => {
                    this.isLoading.set(false)
                }
            ).catch(
                err => {
                    this.showActivateDialog.set(true)
                }
            )
        }).catch((err) => {
            if (err.response.status === 403) {
                this.showVerifyEmail.set(true)
            }
            if (err.error.status === 401) {
                this.routingSvc.intended.set('create-student')
                this.router.navigate(['/login']).then(() => {
                    this.flashMessageSvc.messages().push({
                        message: 'Necesitas iniciar sesion para poder activar tu cuenta, si no tiene cuenta creese una aqui',
                        type: 'error',
                        duration: 20,
                        link: 'register'
                    })
                })
                return
            }
        })

    }
}
