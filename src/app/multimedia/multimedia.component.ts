import { Component, input } from '@angular/core';
import { FileR } from '../models/properties/file';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.css'
})
export class MultimediaComponent {
  file = input<FileR>()

  constructor(
    public loginSvc : LoginService
  ){}
}
