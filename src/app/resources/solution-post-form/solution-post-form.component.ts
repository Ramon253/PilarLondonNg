import {Component, input, output, signal} from '@angular/core';
import {Solution} from '../../models/solution';
import {FormPostComponent} from '../form-post/form-post.component';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Link} from '../../models/properties/link';
import {SolutionService} from '../../services/solution.service';
import {LoginService} from '../../login.service';
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";

@Component({
    selector: 'app-solution-post-form',
    standalone: true,
    imports: [FormPostComponent, ReactiveFormsModule, LoadingWheelComponent],
    templateUrl: './solution-post-form.component.html',
    styles: ``
})
export class SolutionPostFormComponent {

    solution = signal<Solution>({updated_at: new Date()})
    files = signal<File[]>([])
    links = signal<Link[]>([])
    isLoading = signal<boolean>(false)
    assignment = input.required<string>()

    solutionForm = this.formBuilder.group({
        description: [' ', Validators.maxLength(250)],
    })

    newSolution = output<Solution>()

    createSolution(event: SubmitEvent) {
        this.isLoading.set(true)
        event.preventDefault()

        if (this.files().length !== 0) {
            let formData = new FormData
            for (const key in this.files()) {
                formData.append(`files[${key}]`, this.files()[key])
            }

            formData.append('description', this.solutionForm.get('description')?.value ?? ' ')

            if (this.links().length !== 0) {
                for (const key in this.links()) {
                    formData.append(`links[${key}][link_name]`, this.links()[key].link_name)
                    formData.append(`links[${key}][link]`, this.links()[key].link)
                }
            }

            this.solutionSvc.postSolution(this.assignment(), this.solution(), formData).subscribe(
                res => {
                    console.log(res.solution)
                    this.isLoading.set(false)
                    this.newSolution.emit(res.solution)
                },
                err => {
                    this.isLoading.set(false)
                }
            )
            return
        }
        this.solution().links = this.links()
        this.solution().description = this.solutionForm.get('description')?.value ?? ''

        this.solutionSvc.postSolution(this.assignment(), this.solution()).subscribe(
            res => {
                this.isLoading.set(false)
                this.newSolution.emit(res.solution)
            },
            err => {
                this.isLoading.set(false)
            }
        )
    }

    constructor(
        public formBuilder: FormBuilder,
        private solutionSvc: SolutionService,
        public loginSvc: LoginService
    ) {
    }

}
