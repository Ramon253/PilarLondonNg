import { Component, input } from '@angular/core';
import { FileR } from '../models/properties/file';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.css'
})
export class MultimediaComponent {
  file = input<FileR>()
}
