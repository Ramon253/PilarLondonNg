import { Component, ContentChild, ElementRef, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [],
  templateUrl: './videos.component.html'
})
export class VideosComponent {
  constructor(
    private renderer: Renderer2
  ){}

  @ViewChild('videos') videos! : ElementRef
  @ViewChild('rick') rick! : ElementRef

  getUrl(originUrl : string): string{
    return originUrl.replace('youtu.be', 'youtube.com/embed')
  }
  upload(input: HTMLInputElement, event: SubmitEvent){
    event.preventDefault()
    let newVideo = this.rick.nativeElement.cloneNode(true)
    newVideo.src = this.getUrl(input.value)
    this.renderer.appendChild(this.videos.nativeElement, newVideo)
    input.value = ''
  }
}
