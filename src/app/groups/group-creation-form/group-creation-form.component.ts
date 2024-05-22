import {Component, ElementRef, signal, viewChild} from '@angular/core';
import {Group} from "../../models/group";

@Component({
  selector: 'app-group-creation-form',
  standalone: true,
  imports: [],
  templateUrl: './group-creation-form.component.html',
  styleUrl: './group-creation-form.component.css'
})
export class GroupCreationFormComponent {

    bannerInput = viewChild<ElementRef>('banner')
    group = signal<Group>({})

    getBanner(event : Event){
        event.preventDefault()
        this.bannerInput()?.nativeElement.click();
    }
}
