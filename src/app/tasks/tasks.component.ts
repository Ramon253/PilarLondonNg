import { Component } from '@angular/core';
import { Task } from '../models/task';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  tasks : Task[] = []
  
}
