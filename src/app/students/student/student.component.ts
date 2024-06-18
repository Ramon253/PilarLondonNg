import {Component, signal} from '@angular/core';
import {StudentService} from "../../services/student.service";
import {LoginService} from "../../login.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Student} from "../../models/student";
import {environment} from "../../../environments/environment.development";
import {User} from "../../models/user/user";
import {Group} from "../../models/group";
import {Solution} from "../../models/solution";
import {GroupCardComponent} from "../../groups/group-card/group-card.component";
import {SolutionCardComponent} from "../../resources/solution-card/solution-card.component";
import {DatePipe} from "@angular/common";
import {DialogComponent} from "../../dialog/dialog.component";
import {ImageCropperComponent} from "ngx-image-cropper";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Parent} from "../../models/parent";
import {YourSolutionCardComponent} from "../../solution/your-solution-card/your-solution-card.component";
import {TeacherService} from "../../services/teacher.service";
import {FlashMessageService} from "../../services/flash-message.service";

@Component({
    selector: 'app-student',
    standalone: true,
    imports: [
        GroupCardComponent,
        SolutionCardComponent,
        RouterLink,
        DialogComponent,
        ImageCropperComponent,
        LoadingWheelComponent,
        ReactiveFormsModule,
        YourSolutionCardComponent
    ],
    templateUrl: './student.component.html',
    styles: ``
})
export class StudentComponent {
    student = signal<Student>({})
    croppedImage: any = ''
    user = signal<User>({
        name: '',
        email: '',
        id: '',
        password: ''
    })

    edit = signal<boolean>(false)
    cacheBuster = ''
    originalImage: any = ''
    parents = signal<Parent[]>([])
    groups = signal<Group[]>([])
    submissions = signal<Solution[]>([])
    showCropper = signal<boolean>(false)
    unmarkedSolutions = 0
    show = signal<any>({
        data: true,
        solutions: false,
        groups: false
    })

    isLoading = signal<boolean>(true)
    isLoadingPut = signal<boolean>(false)
    isLoadingPutImage = signal<boolean>(false)

    editForm: FormGroup = new FormGroup({})

    showTutors = signal<boolean>(false)

    constructor(
        private studentSvc: StudentService,
        public loginSvc: LoginService,
        private route: ActivatedRoute,
        private router: Router,
        public datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private teacherSvc: TeacherService,
        private messageSvc : FlashMessageService
    ) {
    }

    getTab() {
        if (this.show().data) return 'translate-x-0'
        if (this.show().groups) return 'translate-x-[100%]'
        if (this.show().solutions) return 'translate-x-[220%]'
        return ''
    }

    getAvgNote() {
        let avg = 0
        this.unmarkedSolutions = 0
        for (const submission of this.submissions()) {
            if (submission.note === null) {
                this.unmarkedSolutions++
                continue;
            }

            avg += parseFloat(submission.note ?? '')
        }
        return avg / (this.submissions().length - this.unmarkedSolutions)
    }


    ngOnInit() {

        if (this.router.url.includes('/profile')) {
            if (this.loginSvc.user()?.role === 'teacher')
                this.teacherSvc.getProfile().then(
                    res => {
                        this.mapProfile(res)
                        this.startForm()
                    }
                )
            if (this.loginSvc.user()?.role === 'student'){
                this.studentSvc.getProfile().then((res) =>{
                    this.mapProfile(res)
                    this.startForm()
                })
            }
            return
        }
        this.route.params.subscribe(
            params => {
                this.studentSvc.getStudent(params['student']).then(
                    res => {
                        this.mapProfile(res)
                        this.startForm()
                    }
                )
            }
        )
    }

    private startForm() {
        this.editForm = this.formBuilder.group({
            full_name: [this.student().full_name, Validators.required],
            surname: [this.student().surname, Validators.required],
            birth_date: [this.student().birth_date, Validators.required],
            level: [this.student().level, Validators.required],
            phone_number: [this.student().phone_number]
        })
    }

    private mapProfile = (res: any) => {
        this.isLoading.set(false)
        this.student.set(res.data.student)
        this.parents.set(res.data.parents)
        this.user.set(res.data.user)
        this.submissions.set(res.data.submissions)
        this.groups.set(res.data.groups)
    }

    resetShow() {
        this.show.set({
            data: false,
            solutions: false,
            groups: false

        })
    }

    getImage() {
        this.isLoadingPutImage.set(true)
        const formData = new FormData()
        formData.append('profile_photo', this.croppedImage.blob)
        this.studentSvc.putProfileImage(formData).then(
            res => {
                this.showCropper.set(false)
                this.isLoadingPutImage.set(false)
                this.cacheBuster = `?cb=${new Date().getTime()}`
            }
        )
    }

    putStudent(event: SubmitEvent) {
        event.preventDefault()
        if (this.editForm.invalid) return

        this.isLoadingPut.set(true)
        let student: Student = this.editForm.getRawValue()
        this.studentSvc.putStudent(student).then(
            res => {
                this.edit.set(false)
                this.isLoadingPut.set(false)
                this.student.set(res.data.student)
            }
        ).catch((err)=>{

            if(err.response.data.message.includes('phone')){
               this.messageSvc.messages().push({
                   message : 'El telefono debe ser valido',
                   type : 'error',
                   duration : 10
               })
            }
            this.edit.set(false)
            this.isLoadingPut.set(false)
        })
    }

    getProfile(event: any) {
        if (event.target.files.item(0) === null) return
        this.showCropper.set(true)
        this.originalImage = event
    }

    getUrl() {
        return `${environment.baseUrl}api/user/${this.student().user_id}/profile-picture${this.cacheBuster}`
    }

    protected readonly environment = environment;
    protected readonly parseInt = parseInt;
}
