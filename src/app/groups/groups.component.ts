import {Component, signal} from '@angular/core';
import {GroupService} from "../services/group.service";
import {Group} from "../models/group";
import {LoginService} from "../login.service";
import {GroupCardComponent} from "./group-card/group-card.component";


@Component({
  selector: 'app-groups',
  standalone: true,
    imports: [
        GroupCardComponent
    ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
    groups = signal<Group[]>([])
    isLoading = signal<boolean>(true)

    constructor(
        private groupSvc : GroupService,
        public loginSvc : LoginService
    ) {
    }

    ngOnInit(){
        this.groupSvc.getGroups().subscribe(
            groups => {
                this.groups.set(groups)
                this.isLoading.set(false)
            }
        )
    }

}
