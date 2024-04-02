import { Component, Signal, signal, OutputRefSubscription } from '@angular/core';
import { DogModelService } from '../dog-model.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styles: ``
})
export class IndexComponent {
   dog = signal<any>('no-image');

  constructor(
    private DogModel : DogModelService
    ){ this.getDog()}
    
   getDog(){
    this.DogModel.getDogs().subscribe(
      res => {
        this.dog.set(res.message)
      }
    )
   }
}
