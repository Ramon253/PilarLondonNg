import {Component, ElementRef, Renderer2, viewChild} from '@angular/core';

@Component({
    selector: 'app-location',
    standalone: true,
    imports: [],
    templateUrl: './location.component.html',
    styleUrl: './location.component.css'
})
export class LocationComponent {

    view = viewChild<ElementRef>('view')
    street = viewChild<ElementRef>('street')
    timeTable = viewChild<ElementRef>('timetable')
    svgLocation = viewChild<ElementRef>('svgLocation')
    locationShadow = viewChild<ElementRef>('locationShadow')

    constructor(
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        setTimeout(() =>{
            this.renderer.setStyle(this.svgLocation()?.nativeElement, 'transform', 'translateY(0)')
            this.renderer.setStyle(this.locationShadow()?.nativeElement, 'transform', 'scale(100%)')
            this.renderer.setStyle(this.street()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.timeTable()?.nativeElement, 'transform', 'translateX(0)')
        },100)

        this.renderer.setStyle(this.svgLocation()?.nativeElement, 'transform', 'translateY(-300%)')
        this.renderer.setStyle(this.locationShadow()?.nativeElement, 'transform', 'scale(0)')
        this.renderer.setStyle(this.street()?.nativeElement, 'transform', 'translateX(200%)')
        this.renderer.setStyle(this.timeTable()?.nativeElement, 'transform', 'translateX(-200%)')
        this.view()?.nativeElement.scrollIntoView(false)

    }
}
