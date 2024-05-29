import {Injectable, signal} from '@angular/core';
import {FlashMessage} from "../models/flash-message";

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {

    public messages = signal<FlashMessage[]>([])
  constructor() { }
}
