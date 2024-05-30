import {Injectable, output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
    scrollTop = output<number>()
  constructor() { }
}
