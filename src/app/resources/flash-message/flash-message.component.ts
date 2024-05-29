import {Component, ElementRef, input, Renderer2, signal, viewChild} from '@angular/core';
import {FlashMessage} from "../../models/flash-message";
import {FlashMessageService} from "../../services/flash-message.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-flash-message',
    standalone: true,
    imports: [],
    templateUrl: './flash-message.component.html',
    styleUrl: './flash-message.component.css'
})
export class FlashMessageComponent {

    message = input.required<FlashMessage>()
    duration = input<number>(10)
    messageElement = viewChild<ElementRef>('messageElement')
    timeBar = viewChild<ElementRef>('timeBar')

    constructor(
        private renderer : Renderer2,
    ) {
    }

    ngOnInit(){
        setTimeout(()=> {
            this.renderer.setStyle(this.timeBar()?.nativeElement, 'transition-duration', this.duration() + 's')
            this.renderer.setStyle(this.timeBar()?.nativeElement, 'transform', 'translateX(-110%)')
        }, 10)

        setTimeout(()=> {
            this.close()
        }, 1000 * this.duration())
    }


    close(){
        this.messageElement()?.nativeElement.classList.add('-translate-y-[150%]')
        setTimeout(() => {
            this.messageElement()?.nativeElement.classList.add('hidden')
        }, 100)
    }
}
