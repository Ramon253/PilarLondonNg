import {Component, signal} from '@angular/core';
import {DogModelService} from "../../../../dog-model.service";

@Component({
  selector: 'app-snoopy-dog',
  standalone: true,
  imports: [],
  templateUrl: './snoopy-dog.component.html',
  styleUrl: './snoopy-dog.component.css'
})
export class SnoopyDogComponent {
    dog = signal<any>('no-image');

    constructor(
        private DogModel : DogModelService
    ){
        this.getDog()
    }

    getDog(){
        this.DogModel.getDogs().subscribe(
            res => {
                this.dog.set(res.message)
            }
        )
    }
}
