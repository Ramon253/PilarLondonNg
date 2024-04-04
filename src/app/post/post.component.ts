import { ApplicationRef, Component, ElementRef, EnvironmentInjector, ViewChild, Renderer2, signal } from '@angular/core';

import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styles: ``
})
export class PostComponent {

  tytle = signal<string>('mi post')
  
  constructor(
    private injector : EnvironmentInjector,
    private appRef: ApplicationRef,
    private renderer: Renderer2,
    private el: ElementRef
    ){}



  addVideo(container : HTMLDivElement, url: string){
    const iframe = this.renderer.createElement('iframe');
    this.renderer.setAttribute(iframe, 'src', url)
    this.renderer.setAttribute(iframe, 'frameholder', "0")
    this.renderer.setAttribute(iframe, 'allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
    this.renderer.setAttribute(iframe, 'referrerpolicy', "strict-origin-when-cross-origin")
    this.renderer.addClass(iframe,'aspect-video')
    this.renderer.addClass(iframe,'size-full')
    this.renderer.appendChild(container, iframe)
  }  
}
