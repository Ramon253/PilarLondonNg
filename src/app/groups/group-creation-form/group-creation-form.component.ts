import {Component, ElementRef, output, signal, viewChild} from '@angular/core';
import {Group} from "../../models/group";
import {GroupService} from "../../services/group.service";
import { Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationsService} from "../../services/validations.service";

@Component({
  selector: 'app-group-creation-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './group-creation-form.component.html',
  styleUrl: './group-creation-form.component.css'
})
export class GroupCreationFormComponent {

    bannerInput = viewChild<ElementRef>('banner')
    close = output<boolean>()
    newGroup = output<Group>()

    form = this.formBuilder.group({
        name : ['', Validators.required],
        banner : [''],
        lesson_days : ['', Validators.required],
        lessons_time : ['', Validators.required],
        capacity : ['', Validators.required, Validators.min(0)],
        level : ['', Validators.required, Validators.pattern('^(A[12]|B[12]|C1)$')],
    })

    constructor(
        private groupService: GroupService,
        private router: Router,
        private formBuilder: FormBuilder,
        private validationSvc : ValidationsService
    ) {}
    showMenu(event : Event){
        event.preventDefault()
        this.bannerInput()?.nativeElement.click();
    }
    getBanner(event : any   ){
        if (event.target.files.item(0) !== null) {
            this.form.get('banner')?.setValue(event.target.files.item(0))
        }
    }

    createGroup(event : SubmitEvent) {
        event.preventDefault()
       if (this.form.invalid){
            return
        }
        const inputGroup = this.form.getRawValue()
        const formData = new FormData()
        formData.append('name', inputGroup.name ?? '')
        formData.append('lesson_days', inputGroup.lesson_days ?? '')
        formData.append('level', inputGroup.level ?? '')
        formData.append('lessons_time', inputGroup.lessons_time ?? '')
        /*TODO*/
        formData.append('banner', inputGroup.lessons_time ?? '')
        formData.append('capacity', inputGroup.capacity ?? '')

        this.groupService.postGroup(formData).then(
            group => {
                this.newGroup.emit(group)
                this.close.emit(true)
            }
        ).catch(error => {

        })

    }
}
