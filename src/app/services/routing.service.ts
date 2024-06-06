import {Injectable, signal} from '@angular/core';
import {Router} from "@angular/router";
import {FlashMessage} from "../models/flash-message";

@Injectable({
    providedIn: 'root'
})
export class RoutingService {
    previous = signal<string>('/')
    intended = signal<string>('/')

    constructor(private router: Router) {
    }
}
