import { Component, Signal, signal, OutputRefSubscription } from '@angular/core';
import {LoginService} from "../login.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LandingComponent} from "./landing/landing.component";
import {TeacherDashboardComponent} from "./teacher-dashboard/teacher-dashboard.component";

@Component({
  selector: 'app-index',
  standalone: true,
    imports: [
        DashboardComponent,
        LandingComponent,
        TeacherDashboardComponent
    ],
  templateUrl: './index.component.html',
  styles: ``
})
export class IndexComponent {

    constructor(
        public loginSvc : LoginService
    ) {
    }
}
