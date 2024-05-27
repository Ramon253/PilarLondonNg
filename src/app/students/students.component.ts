import {Component, signal} from '@angular/core';
import {StudentService} from "../services/student.service";
import {LoginService} from "../login.service";
import {Student} from "../models/student";
import {StudentCardComponent} from "./student-card/student-card.component";
import {DialogComponent} from "../dialog/dialog.component";
import {LoadingWheelComponent} from "../svg/loading-wheel/loading-wheel.component";

@Component({
  selector: 'app-students',
  standalone: true,
    imports: [
        StudentCardComponent,
        DialogComponent,
        LoadingWheelComponent
    ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent {

    isLoading = signal<boolean>(true)
    students = signal<Student[]>([])
    showGenerateDialog = signal<boolean>(false)

    showCode = signal<boolean>(false)
    isLoadingWaitList = signal<boolean>(false)
    isLoadingCode =  signal<boolean>(false)
    code = signal<string>('')
    constructor(
        private studentSvc : StudentService,
        public loginSvc : LoginService
    ) {
    }

    ngOnInit(){
        this.studentSvc.getStudents().then(
            res => {
                this.students.set(res.data)
                this.isLoading.set(false)
            }
        )
    }

    getCode(){
        this.isLoadingCode.set(true)
        this.studentSvc.generateCode().then(
            res=> {
                this.isLoadingCode.set(false)
                this.code.set(res.data)
                this.showCode.set(true)
            }
        )
    }

    copyToClipboard(){
        navigator.clipboard.writeText(this.code()).then(
            () =>{
                alert('texto copiado ')
            }
        )
    }
}
