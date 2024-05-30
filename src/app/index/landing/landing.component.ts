import {Component, ElementRef, Renderer2, viewChild} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-landing',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

    constructor(
        public scrollSvc : ScrollService,
        private router: Router,
        private renderer : Renderer2
    ) {
    }

    foto1 = viewChild<ElementRef>('foto1')
    foto2 = viewChild<ElementRef>('foto2')
    text1 = viewChild<ElementRef>('text1')
    text2 = viewChild<ElementRef>('text2')
    heroCircle = viewChild<ElementRef>('heroCircle')

    ngOnInit(){
        this.scrollSvc.scrollTop.subscribe((scrollTop) => {
            this.firstView(scrollTop)
            this.secondView(scrollTop)
            this.hero(scrollTop)
        })
    }
    hero(scrollTop : number){
        if (scrollTop >2500) return;
        if (scrollTop >1800){
            if (this.heroCircle()?.nativeElement.classList.contains('heroAnimation')){
                return;
            }
            this.heroCircle()?.nativeElement.classList.add('heroAnimation')
            return
        }
        this.heroCircle()?.nativeElement.classList.remove('heroAnimation')
    }
    secondView(scrollTop : number){
        if (scrollTop > 1450){
            this.renderer.setStyle(this.foto2()?.nativeElement, 'transform', 'scale(100%)')
            this.renderer.setStyle(this.text2()?.nativeElement, 'transform', 'scale(100%)')
            return;
        }

        if (scrollTop > 1300){
            this.renderer.setStyle(this.foto2()?.nativeElement, 'transform', 'scale(50%)')
            this.renderer.setStyle(this.text2()?.nativeElement, 'transform', 'scale(50%)')
            return
        }
        console.log(scrollTop)
        this.renderer.setStyle(this.foto2()?.nativeElement, 'transform', 'scale(0)')
        this.renderer.setStyle(this.text2()?.nativeElement, 'transform', 'scale(0)')
    }
    firstView(scrollTop : number){
        if (scrollTop >= 1200) return;
        if (scrollTop < 600)
        {
            this.renderer.setStyle(this.foto1()?.nativeElement, 'transform', 'translateX(-200%)')
            this.renderer.setStyle(this.text1()?.nativeElement, 'transform', 'translateX(200%)')
            return
        }
        this.renderer.setStyle(this.foto1()?.nativeElement, 'transform', 'translateX(0)')
        this.renderer.setStyle(this.text1()?.nativeElement, 'transform', 'translateX(0)')
    }
}
