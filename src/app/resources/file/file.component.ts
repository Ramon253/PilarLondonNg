import { Component, SimpleChange, SimpleChanges, input, output, signal } from '@angular/core';
import { FileR } from '../../models/properties/file';
import { LoginService } from '../../login.service';
import { LoadingWheelComponent } from '../../svg/loading-wheel/loading-wheel.component';
import { FileService } from '../../services/resources/file.service';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [LoadingWheelComponent],
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent {
  file = input<FileR>()

  hoverCloseButton = signal<boolean>(false)
  delete = output<{ id: string, isMultimedia: boolean }>()

  isLoadingDelete = signal<boolean>(false)

  constructor(
    public loginSvc: LoginService,
    private fileSvc: FileService
  ) { }

  deleteFile() {
    this.fileSvc.destroyFile(this)
  }

  disableLink(event: Event) {
    if (this.hoverCloseButton())
      event.preventDefault()
  }
}
