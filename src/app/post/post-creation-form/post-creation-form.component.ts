import { Component } from '@angular/core';
import { PostComponent } from '../post.component';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-post-creation-form',
  standalone: true,
  imports: [PostComponent],
  templateUrl: './post-creation-form.component.html',
  styles: ``
})
export class PostCreationFormComponent {
  showForm(form: HTMLDivElement){
    form.classList.replace('hidden', 'flex')
  }
  closeForm(form : HTMLDivElement){
    form.classList.replace('flex', 'hidden')
  }
}
