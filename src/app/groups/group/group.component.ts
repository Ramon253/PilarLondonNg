import {Component, ElementRef, input, signal, viewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../login.service";
import {GroupService} from "../../services/group.service";
import {PostService} from "../../services/post.service";
import {AssignmentService} from "../../services/assignment.service";
import {Group} from "../../models/group";
import {AssignmentCardComponent} from "../../assignments/assignment-card/assignment-card.component";
import {PostCardComponent} from "../../posts/post-card/post-card.component";
import {StudentCardComponent} from "../../students/student-card/student-card.component";
import {environment} from "../../../environments/environment.development";
import {DialogComponent} from "../../dialog/dialog.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {Student} from "../../models/student";
import {StudentService} from "../../services/student.service";
import {tryUnwrapForwardRef} from "@angular/compiler-cli/src/ngtsc/annotations/common";
import {PostCreationFormComponent} from "../../posts/post-creation-form/post-creation-form.component";
import {AssignmentFormComponent} from "../../assignments/assignment-form/assignment-form.component";
import {DatePipe} from "@angular/common";
import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";


@Component({
    selector: 'app-group',
    standalone: true,
    imports: [
        AssignmentCardComponent,
        PostCardComponent,
        StudentCardComponent,
        DialogComponent,
        LoadingWheelComponent,
        PostCreationFormComponent,
        AssignmentFormComponent,
        ImageCropperComponent
    ],
    templateUrl: './group.component.html',
    styles: ``
})
export class GroupComponent {

    group = signal<Group>({})

    bannerUrl = signal<string>(``)
    banner = viewChild<ElementRef>('banner')
    showCropper = signal<boolean>(false)
    imageChangedEvent: Event | null = null
    croppedUrl: any = ''
    croppedImg: any = ''
    cacheBuster = ''

    capacity = viewChild<ElementRef>('capacityInput')
    lesson_days = viewChild<ElementRef>('daysInput')
    lessons_lime = viewChild<ElementRef>('timeInput')
    name = viewChild<ElementRef>('nameInput')
    level = viewChild<ElementRef>('levelInput')

    inputs = signal<any>({
        banner: ''
    })

    imageCropped(event: ImageCroppedEvent) {
        this.croppedUrl = event.objectUrl
        this.croppedImg = event.blob
    }

    isLoading = signal<boolean>(true)
    isLoadingStudents = signal<boolean>(false)
    isLoadingPost = signal<boolean>(false)
    isLoadingKick = signal<boolean>(false)
    isLoadingPut = signal<boolean>(false)
    isLoadingPutBanner = signal<boolean>(false)
    update = signal<any>({
        name: false,
        level: false,
        banner: false,
        lesson_days: false,
        lessons_time: false,
        capacity: false
    })

    selectedContent = signal<string>('general')
    students = signal<Student[]>([])
    showCreate = signal<any>({
        post: false,
        assignment: false,
        student: false,
        banner: false
    })

    constructor(
        private route: ActivatedRoute,
        public loginSvc: LoginService,
        public groupSvc: GroupService,
        private studentSvc: StudentService,
        private postSvc: PostService,
        private assignmentSvc: AssignmentService,
        private router: Router,
        public datePipe: DatePipe
    ) {
    }


    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.groupSvc.getGroup(params['group']).subscribe(
                    res => {
                        this.group.set(this.groupSvc.mapGroup(res))
                        this.bannerUrl.set(`${environment.baseUrl}api/group/${this.group().id ?? ''}/banner`)
                        this.isLoading.set(false)
                    }
                );
            }
        )
    }

    addStudent(select: HTMLSelectElement) {
        this.isLoadingPost.set(true)
        this.groupSvc.joinGroup(this.group().id ?? '', select.value).then(
            res => {
                this.isLoadingPost.set(false)
                this.showCreate().student = false
                this.group().students?.push(this.students().find(student => student.id == select.value) ?? {})
            }
        )
    }

    kickStudent(student_id: string) {
        this.isLoadingKick.set(true)
        this.groupSvc.leaveGroup(this.group().id ?? '', student_id).then(
            res => {
                this.isLoadingKick.set(false)
                this.group().students = this.group().students?.filter(student => student.id !== student_id)
            }
        )
    }

    create() {
        switch (this.selectedContent()) {
            case 'student' : {
                this.showCreate().student = true
                this.isLoadingStudents.set(true)
                this.studentSvc.getStudents().then(
                    res => {
                        const students = this.group().students
                            ?.map(student => student.id)
                        this.students.set(res.data
                            .filter((student: Student) => !students?.includes(student.id)))
                        this.isLoadingStudents.set(false)
                    }
                )
                break;
            }
            case 'post' : {
                this.showCreate().post = true
                break;
            }
            case 'assignment' : {
                this.showCreate().assignment = true
                break
            }
        }
    }

    getTab() {
        switch (this.selectedContent()) {
            case 'general' :
                return 'translate-x-0';
            case 'post' :
                return 'translate-x-28';
            case 'assignment':
                return 'translate-x-56';
            case 'student' :
                return 'translate-x-[21rem]';
            case 'settings':
                return 'translate-x-[28rem] w-10'
        }
        return ''
    }

    updateAny() {
        return this.update().name
            || this.update().level
            || this.update().banner
    }

    settingsUpdateAny() {
        return this.update().lesson_days
            || this.update().lessons_time
            || this.update().capacity
    }


    getBanner(event: any) {
        if (event.target.files.item(0) === null) {
            return
        }
        if (!event.target.files.item(0).type?.includes('image') || event.target.files.item(0).type?.includes('avif')) {
            return;
        }
        this.showCropper.set(true)
        this.imageChangedEvent = event
    }
    getBannerUr(){
        return this.bannerUrl() + this.cacheBuster
    }
    endCrop() {

        const formData = new FormData()
        formData.append('banner', this.croppedImg)
        this.isLoadingPutBanner.set(true)
        this.groupSvc.putBanner(formData, this.group().id ?? '').finally(
            () => {
                this.isLoadingPutBanner.set(false)
                this.showCropper.set(false)
                this.cacheBuster =  `?cb=${new Date().getTime()}`
            }
        )
    }

    putChanges() {

        if (this.update().name) {
            this.group().name = this.name()?.nativeElement.value
        }
        if (this.update().level) {
            this.group().level = this.level()?.nativeElement.value
        }
        if (this.update().lessons_time) {
            this.group().lessons_time = this.lessons_lime()?.nativeElement.value
        }
        if (this.update().lesson_days) {
            this.group().lesson_days = this.lesson_days()?.nativeElement.value
        }
        if (this.update().capacity) {
            this.group().capacity = this.capacity()?.nativeElement.value
        }
        this.isLoadingPut.set(true)
        this.groupSvc.putGroup(this.group(), this.group().id ?? '').then(
            res => {
                this.group.set(this.groupSvc.mapGroup(res.data.group.original))
                this.resetUpdates()
                this.isLoadingPut.set(false)
            }
        ).catch(
            err => {
                this.group.set(err.data.group)
            }
        )
    }

    resetUpdates() {
        this.update.set({
            name: false,
            banner: false,
            lesson_days: false,
            lessons_time: false,
            level: false,
            capacity: false
        })
    }

    protected readonly environment = environment;
}
