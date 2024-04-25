import { Component } from '@angular/core';
import { Assignment } from '../models/assignment';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  tasks : Assignment[] = []

}
