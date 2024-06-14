import {Component, ElementRef, input, viewChild} from '@angular/core';
import {Group} from "../../models/group";
import {DatePipe} from "@angular/common";
import {LoginService} from "../../login.service";
import {Router, RouterLink} from "@angular/router";
import {GroupService} from "../../services/group.service";
import {environment} from "../../../environments/environment.development";

@Component({
    selector: 'app-group-card',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './group-card.component.html',
    styleUrl: './group-card.component.css'
})
export class GroupCardComponent {
    capacity = viewChild<ElementRef>('capacity')
    group = input.required<Group>()

    constructor(
        public datePipe: DatePipe,
        public loginSvc: LoginService,
        public groupSvc : GroupService,
        private router: Router,
    ) {
    }

    onClick(){
       if (!this.loginSvc.isLogged() || this.loginSvc.user()?.role === 'none')
           return;
        this.router.navigate(['/group/' + this.group().id]);
    }

    showDays() {
        switch (this.group().lesson_days) {
            case 'l-m' : {
                return 'Lunes y miercoles'
            }
            case 'm-j' : {
                return 'Martes y jueves'
            }
            case 'v' : {
                return 'Viernes'
            }
        }
        return 'null'
    }

    ngOnInit() {
        this.capacity()?.nativeElement.classList.add(this.group().capacity ?? 1 < (this.group().studentNumber ?? 1) ? 'text-dark-font' : 'text-secondary')
    }

    protected readonly environment = environment;
    protected readonly onclick = onclick;
}
