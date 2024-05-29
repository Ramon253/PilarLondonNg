import { Component, Signal, signal, OutputRefSubscription } from '@angular/core';
import { DogModelService } from '../dog-model.service';
import {LoginService} from "../login.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LandingComponent} from "./landing/landing.component";

@Component({
  selector: 'app-index',
  standalone: true,
    imports: [
        DashboardComponent,
        LandingComponent
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
