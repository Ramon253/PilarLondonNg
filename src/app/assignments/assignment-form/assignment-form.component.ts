import {Component, ElementRef, input, output, signal, viewChild} from '@angular/core';
import {FormPostComponent} from "../../resources/form-post/form-post.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";
import {AssignmentService} from "../../services/assignment.service";
import {Link} from "../../models/properties/link";
import {Assignment} from "../../models/assignment";

@Component({
    selector: 'app-assignment-form',
    standalone: true,
    imports: [
        FormPostComponent,
        LoadingWheelComponent,
        ReactiveFormsModule,
        ValidationErrorComponent
    ],
    templateUrl: './assignment-form.component.html',
    styles: ``
})
export class AssignmentFormComponent {
    close = output<boolean>()
    group = input<string | null>(null)
    groups = input<{ name: string, id: string }[]>([])
    newAssignment = output<Assignment>()
    isLoading = signal<boolean>(false)
    showError = signal<boolean>(false)
    files = signal<File[]>([])
    links = signal<Link[]>([])
    dateValid = signal<boolean>(false)
    description = viewChild<ElementRef>('description')
    assignmentForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [undefined, Validators.maxLength(500)],
        group_id: ['', Validators.required],
        dead_line: [new Date(), Validators.required]
    })

    constructor(
        public assignmentSvc: AssignmentService,
        private formBuilder: FormBuilder
    ) {
    }

    tryPost() {
        if (this.assignmentForm.get('group_id')?.invalid)
            this.showError.set(true)
    }

    createAssignment(ev: SubmitEvent, description: HTMLTextAreaElement) {
        if (!this.dateValid()) {
            this.assignmentForm.get('dead_line')?.setErrors({required: true})
            return
        }
        this.isLoading.set(true)
        let formData = undefined
        const assignment = this.assignmentForm.getRawValue() as Assignment

        assignment.dead_line = this.assignmentForm.get('dead_line')?.getRawValue()
        assignment.description = this.description()?.nativeElement.value
        assignment.group_id = this.assignmentForm.get('group_id')?.value ?? ''
        assignment.links = (this.links().length !== 0) ? this.links() : undefined;
        assignment.files = (this.files().length !== 0) ? this.files() : undefined;

        if (assignment.files) {
            formData = new FormData
            for (const key in assignment.files) {
                formData.append(`files[${key}]`, assignment.files[key])
            }
            formData.append('name', assignment.name)
            formData.append('dead_line', assignment.dead_line?.toString() ?? '')
            formData.append('description', assignment.description ?? '')


            if (assignment.links) {
                for (const key in assignment.links) {
                    formData.append(`links[${key}][link_name]`, assignment.links[key].link_name)
                    formData.append(`links[${key}][link]`, assignment.links[key].link)
                }
            }
        }

        this.assignmentSvc.postAssignment(assignment, formData)
            .then(
                res => {
                    this.newAssignment.emit(this.assignmentSvc.mapAssignment(res.data))
                    this.close.emit(true)
                }
            )

        this.links.set([]);
        this.files.set([]);
    }

    toggleForm() {
        this.close.emit(true)
    }

    ngOnInit() {
        if (this.group() === null) {
            return
        }
        this.assignmentForm.get('group_id')?.setValue(this.group())
    }
}
