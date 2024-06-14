import {Component, signal} from '@angular/core';
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {StudentComponent} from "../students/student/student.component";
import {TeacherComponent} from "../teacher/teacher.component";

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        StudentComponent,
        TeacherComponent
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {
    isLoading = signal<boolean>(true)
    show = signal({
        student: false,
        teacher: false,
        none: false
    })

    constructor(
        public loginSvc: LoginService,
        public router: Router
    ) {
    }

    ngOnInit() {
        if (!this.loginSvc.isLogged()) {
            this.router.navigate(['/login'])
        }
        if (this.loginSvc.user() === null) {
            this.loginSvc.userReady.subscribe(() => {
                this.showProfile()
            })
            return
        }
        this.showProfile()
    }
    showProfile(){
        switch (this.loginSvc.user()?.role){
            case 'student' :{
                this.show().student = true
                break;
            }
            case 'teacher' :{
                this.show().teacher = true
                break;
            }
            case 'none' :{
                this.show().student = true
                break;
            }
        }
        this.isLoading.set(false)
    }
}
