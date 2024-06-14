import {Component, signal} from '@angular/core';
import {Teacher} from "../models/teacher";
import {DialogComponent} from "../dialog/dialog.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GroupCardComponent} from "../groups/group-card/group-card.component";
import {ImageCropperComponent} from "ngx-image-cropper";
import {LoadingWheelComponent} from "../svg/loading-wheel/loading-wheel.component";
import {YourSolutionCardComponent} from "../solution/your-solution-card/your-solution-card.component";
import {Student} from "../models/student";
import {User} from "../models/user/user";
import {Parent} from "../models/parent";
import {Group} from "../models/group";
import {Solution} from "../models/solution";
import {StudentService} from "../services/student.service";
import {LoginService} from "../login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {TeacherService} from "../services/teacher.service";
import {environment} from "../../environments/environment.development";

@Component({
  selector: 'app-teacher',
  standalone: true,
    imports: [
        DialogComponent,
        FormsModule,
        GroupCardComponent,
        ImageCropperComponent,
        LoadingWheelComponent,
        ReactiveFormsModule,
        YourSolutionCardComponent
    ],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent {
    teacher = signal<Teacher>({})
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
        data: true
    })

    isLoading = signal<boolean>(true)
    isLoadingPut = signal<boolean>(false)
    isLoadingPutImage = signal<boolean>(false)

    editForm: FormGroup = new FormGroup({})

    constructor(
        private studentSvc: StudentService,
        public loginSvc: LoginService,
        private route: ActivatedRoute,
        private router: Router,
        public datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private teacherSvc: TeacherService
    ) {
    }


    ngOnInit() {
        this.teacherSvc.getProfile().then((res) => {
            this.mapProfile(res)
            this.startForm()
        })

    }

    private startForm() {
        this.editForm = this.formBuilder.group({
            full_name: [this.teacher().full_name, Validators.required],
            surname: [this.teacher().surname, Validators.required],
        })
    }

    private mapProfile = (res: any) => {
        this.isLoading.set(false)
        this.teacher.set(res.data.teacher)
        this.user.set(res.data.user)
    }

    getImage() {
        this.isLoadingPutImage.set(true)
        const formData = new FormData()
        formData.append('profile_photo', this.croppedImage.blob)
        this.teacherSvc.putProfileImage(formData).then(
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
        let teacher : Teacher = this.editForm.getRawValue()
        this.teacherSvc.putTeacher(teacher).then(
            res => {
                this.edit.set(false)
                this.isLoadingPut.set(false)
                this.teacher.set(res.data.teacher)
            }
        )
    }

    getProfile(event: any) {
        if (event.target.files.item(0) === null) return
        this.showCropper.set(true)
        this.originalImage = event
    }

    getUrl() {
        return `${environment.baseUrl}api/user/${this.teacher().user_id}/profile-picture${this.cacheBuster}`
    }

    protected readonly environment = environment;
    protected readonly parseInt = parseInt;

}
