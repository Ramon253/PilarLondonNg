import {Component, ElementRef, Renderer2, viewChild, viewChildren} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ScrollService} from "../services/scroll.service";

@Component({
    selector: 'app-join',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './join.component.html',
    styleUrl: './join.component.css'
})
export class JoinComponent {
    activate = viewChild<ElementRef>('activate')
    howto = viewChild<ElementRef>('howto')
    howToJoin = viewChild<ElementRef>('howToJoin')
    howToCards = viewChildren<ElementRef>('howToCard')

    constructor(
        public scrollSvc: ScrollService,
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.howto()?.nativeElement.classList.remove('-translate-x-full')
            this.activate()?.nativeElement.classList.remove('translate-x-full')
        })
        this.scrollSvc.scrollTop.subscribe((scrollTop) => {
            if (window.innerWidth > 850) {
                if (this.scrollSvc.isVisible(this.howToJoin()?.nativeElement, 4)) {
                    this.howToCards().forEach((ref) => {
                        this.renderer.setStyle(ref.nativeElement, 'transform', 'translateY(0)')
                    })
                    return
                }

                this.renderer.setStyle(this.howToCards().at(0)?.nativeElement, 'transform', 'translateY(200%)')
                this.renderer.setStyle(this.howToCards().at(1)?.nativeElement, 'transform', 'translateY(-200%)')
                this.renderer.setStyle(this.howToCards().at(2)?.nativeElement, 'transform', 'translateY(200%)')
                return;
            }
            if (this.scrollSvc.isVisible(this.howToCards().at(2)?.nativeElement)) {
                this.renderer.setStyle(this.howToCards().at(2)?.nativeElement, 'transform', 'translateY(0)')
                return;
            }
            this.renderer.setStyle(this.howToCards().at(2)?.nativeElement, 'transform', 'translateX(200%)')

            if (this.scrollSvc.isVisible(this.howToCards().at(1)?.nativeElement)) {
                this.renderer.setStyle(this.howToCards().at(1)?.nativeElement, 'transform', 'translateY(0)')
                return;
            }
            this.renderer.setStyle(this.howToCards().at(1)?.nativeElement, 'transform', 'translateX(-200%)')

            if (this.scrollSvc.isVisible(this.howToCards().at(0)?.nativeElement)) {
                this.renderer.setStyle(this.howToCards().at(0)?.nativeElement, 'transform', 'translateY(0)')
                return;
            }
            this.renderer.setStyle(this.howToCards().at(0)?.nativeElement, 'transform', 'translateX(200%)')


        })
    }


    goToHowTo() {
        this.howToJoin()?.nativeElement.scrollIntoView({behavior: 'smooth'})
    }
}
