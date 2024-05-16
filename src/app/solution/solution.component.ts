import {Component, input} from '@angular/core';
import {Solution} from "../models/solution";
import {FileComponent} from "../resources/file/file.component";

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [FileComponent],
  templateUrl: './solution.component.html',
  styles: ``
})
export class SolutionComponent {

}
