import { Component, input, output, signal } from '@angular/core';
import { FileR } from '../models/properties/file';
import { LoginService } from '../login.service';
import { LoadingWheelComponent } from '../svg/loading-wheel/loading-wheel.component';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [LoadingWheelComponent],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.css'
})
export class MultimediaComponent {
  file = input<FileR>()
  delete = output<boolean>()
  isLoadingDelete = signal<boolean>(false)
  constructor(
    public loginSvc : LoginService
  ){}
}
