import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-youtube-video',
  standalone: true,
  imports: [],
  templateUrl: './youtube-video.component.html',
  styleUrl: './youtube-video.component.css'
})
export class YoutubeVideoComponent {
  
  @ViewChild('container') container! : ElementRef
  @Input({required : true}) url! : string
  @Input({required : true}) text! : string

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    public loginSvc : LoginService
  ){}

  ngAfterViewInit(){
    if(this.url.includes('youtube.com/embed')) return

    if (this.url.includes('drive.google.com')){
      this.url = this.url.replace('view', 'preview')
    }
    this.url = this.url.replace('youtube.com', 'youtube.com/embed')
    this.url = this.url.replace('youtu.be', 'youtube.com/embed')
    this.addVideo(this.container.nativeElement, this.url, this.text)
  }



  addVideo(container : HTMLDivElement, url: string, text :string){
    const iframe = this.renderer.createElement('iframe');
    this.renderer.setAttribute(iframe, 'src', url)
    this.renderer.setAttribute(iframe, 'title', text)
    this.renderer.setAttribute(iframe, 'frameholder', "0")
    this.renderer.setAttribute(iframe, 'allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
    this.renderer.setAttribute(iframe, 'referrerpolicy', "strict-origin-when-cross-origin")
    this.renderer.setAttribute(iframe, "allowfullscreen", "")
    this.renderer.addClass(iframe,'aspect-video')
    this.renderer.addClass(iframe,'size-full')
    this.renderer.appendChild(container, iframe)
  }  

}
