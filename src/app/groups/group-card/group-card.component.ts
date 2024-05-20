import {Component, input} from '@angular/core';
import {Group} from "../../models/group";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent {

    group = input.required<Group>()

    constructor(
        public datePipe : DatePipe
    ) {
    }
    getDate(){
        console.log(this.datePipe.transform(this.group().lesson_time, 'HH:mm:ss'))
    }

    showDays(){
        this.getDate()
        switch (this.group().lesson_days){
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
}
