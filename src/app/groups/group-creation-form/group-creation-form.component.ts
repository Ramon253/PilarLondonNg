import {Component, ElementRef, output, signal, viewChild} from '@angular/core';
import {Group} from "../../models/group";
import {GroupService} from "../../services/group.service";
import {Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationsService} from "../../services/validations.service";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-group-creation-form',
    standalone: true,
    imports: [ReactiveFormsModule, LoadingWheelComponent, ImageCropperComponent, NgOptimizedImage],
    templateUrl: './group-creation-form.component.html',
    styleUrl: './group-creation-form.component.css'
})
export class GroupCreationFormComponent {

    bannerInput = viewChild<ElementRef>('banner')
    close = output<boolean>()
    newGroup = output<Group>()
    bannerFile = signal<File | undefined>(undefined)
    isLoading = signal<boolean>(false)
    showCropper = signal<boolean>(false)
    croppedUrl: any = ''
    croppedImg: any = ''
    imageChangedEvent: Event | null = null

    form = this.formBuilder.group({
        name: ['', Validators.required],
        banner: ['', Validators.required],
        lesson_days: ['', Validators.required],
        lessons_time: ['', Validators.required],
        capacity: ['', Validators.required, Validators.min(0)],
        level: ['', Validators.required, Validators.pattern('^(A[12]|B[12]|C1)$')],
    })

    constructor(
        private groupService: GroupService,
        private router: Router,
        private formBuilder: FormBuilder,
        private validationSvc: ValidationsService
    ) {
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedUrl = event.objectUrl
        this.croppedImg = event.blob
    }

    showMenu(event: Event) {
        event.preventDefault()
        this.bannerInput()?.nativeElement.click();
    }

    getBanner(event: any) {
        if (event.target.files.item(0) === null ) {
            return
        }

        if (!event.target.files.item(0).type?.includes('image') || event.target.files.item(0).type?.includes('avif')){
            return;
        }
        this.showCropper.set(true)
        this.imageChangedEvent = event

        this.bannerFile.set(event.target.files.item(0))

    }

    createGroup(event: SubmitEvent) {
        event.preventDefault()
        if (this.form.invalid) {
            return
        }
        const inputGroup = this.form.getRawValue()
        const formData = new FormData()
        formData.append('name', inputGroup.name ?? '')
        formData.append('lesson_days', inputGroup.lesson_days ?? '')
        formData.append('level', inputGroup.level ?? '')
        formData.append('lessons_time', inputGroup.lessons_time ?? '')
        formData.append('banner', inputGroup.banner ?? '')
        formData.append('capacity', inputGroup.capacity ?? '')

        this.isLoading.set(true)
        this.groupService.postGroup(formData).then(
            response => {
                this.newGroup.emit(response.data.group)
                this.close.emit(true)
            }
        ).catch(error => {

        }).finally(() => this.isLoading.set(false))

    }
    endCrop(){
        this.showCropper.set(false)
        this.form.get('banner')?.setValue(this.croppedImg)
    }


    protected readonly alert = alert;
}
