import {Component, ElementRef, input, signal, viewChild} from '@angular/core';
import {FlashMessage} from "../../models/flash-message";

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

    ngOnInit(){
        setTimeout(()=> {
            this.messageElement()?.nativeElement.classList.add('bounce')
        }, 300)
        setTimeout(()=> {
            this.messageElement()?.nativeElement.classList.remove('-translate-y-[150%]')
            this.timeBar()?.nativeElement.classList.add(['-translate-x-full'])
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
