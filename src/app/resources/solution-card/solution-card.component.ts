import {Component, input} from '@angular/core';
import {Solution} from '../../models/solution';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-solution-card',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './solution-card.component.html',
    styles: ``
})
export class SolutionCardComponent {
    solution = input.required<Solution>()
    dead_line = input<Date>()

    constructor(
        public date: DatePipe
    ) {
    }

    checkDate() {
        if (this.dead_line())
            return this.solution().updated_at <= (this.dead_line() ?? new Date())
        return true
    }
}
