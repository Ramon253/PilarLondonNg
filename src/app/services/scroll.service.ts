import {Injectable, output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
    scrollTop = output<number>()

    isVisible(value: HTMLDivElement, height: number = 7) {
        const item = value.getBoundingClientRect();
        console.log(item.top)
        return (
            item.top < height * (window.innerHeight / 10)
        )

    }
  constructor() { }
}
