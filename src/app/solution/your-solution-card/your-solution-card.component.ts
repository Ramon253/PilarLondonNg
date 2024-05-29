import {Component, input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Solution} from "../../models/solution";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-your-solution-card',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './your-solution-card.component.html',
  styleUrl: './your-solution-card.component.css'
})
export class YourSolutionCardComponent {
    solution = input.required<Solution>()


    constructor(
        public datePipe : DatePipe
    ) {
    }
    protected readonly parseInt = parseInt;
}
