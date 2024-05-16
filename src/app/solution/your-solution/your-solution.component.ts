import {Component, input} from '@angular/core';
import {Solution} from "../../models/solution";
import {FileComponent} from "../../resources/file/file.component";

@Component({
  selector: 'app-your-solution',
  standalone: true,
    imports: [
        FileComponent
    ],
  templateUrl: './your-solution.component.html',
  styles: ``
})
export class YourSolutionComponent {
    solution = input.required<Solution>()
}
