import { Component, ElementRef, Input, SimpleChange, ViewChild, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-youtube-video',
  standalone: true,
  imports: [],
  templateUrl: './youtube-video.component.html',
  styleUrl: './youtube-video.component.css'
})
export class YoutubeVideoComponent {
  @Input({required: true}) url : string = "https://www.youtube.com/embed/kHDSrHXqe-Y?si=b7EZ4CLVP_6ElTO0"
  iframe : HTMLIFrameElement
  tittle = "nidea"

  constructor(private renderer: Renderer2, private el: ElementRef){
    this.iframe = this.renderer.createElement('iframe');
    this.renderer.setAttribute(this.iframe, 'src', this.url)
    this.renderer.setAttribute(this.iframe, 'frameholder', "0")
    this.renderer.setAttribute(this.iframe, 'allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
    this.renderer.setAttribute(this.iframe, 'referrerpolicy', "strict-origin-when-cross-origin")
    this.renderer.addClass(this.iframe,'aspect-video')
    this.renderer.addClass(this.iframe,'size-full')
    this.renderer.appendChild(this.el.nativeElement, this.iframe)
  }
}
