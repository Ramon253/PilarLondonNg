import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { Link } from '../../models/properties/link';
import { FileR } from '../../models/properties/file';
import { ValidationErrorComponent } from '../../validations/validation-error/validation-error.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-post',
  standalone: true,
  imports: [ValidationErrorComponent, ReactiveFormsModule],
  templateUrl: './form-post.component.html',
  styleUrl: './form-post.component.css'
})
export class FormPostComponent {
  links = input<Link[]>([])
  files = input<File[]>([])


  openLinks = viewChild<ElementRef>('openLink')
  closeLinks = viewChild<ElementRef>('closeLink')
  formLink = viewChild<ElementRef>('formLink')
  linkMenu = viewChild<ElementRef>('linkMenu')

  open = output<boolean>()
  newLinks = output<Link[]>()
  newFiles = output<File[]>()

  linkForm = this.formBulider.group({
    link_name: ['', Validators.required],
    link: ['', Validators.required]
  })

  constructor(
    private formBulider : FormBuilder
  ){}
  
  createLink() {
    const link = {
      link_name: this.linkForm.get('link_name')?.value,
      link: this.linkForm.get('link')?.value
    } as Link;


    this.links().push(link)

    this.addLink()
    this.linkForm.get('link_name')?.setValue('')
    this.linkForm.get('link')?.setValue('')


    this.newLinks.emit(this.links())
  }

  addLink() {
    this.openLinks()?.nativeElement.classList.toggle('hidden')
    this.closeLinks()?.nativeElement.classList.toggle('hidden')

    this.linkMenu()?.nativeElement.classList.toggle('-translate-x-[50%]')
    this.formLink()?.nativeElement.classList.toggle('h-10')
    this.formLink()?.nativeElement.classList.toggle('h-fit')

    this.open.emit(true)
  }

  addFile(event: any) {
    if (event.target.files.item(0) !== null) {
      this.files().push(event.target.files.item(0))
      this.newFiles.emit(this.files())
    }
  }


  deleteLink(link: Link) {
    this.links()?.splice(this.links().indexOf(link), 1)
  }
  deleteFile(file: File) {
    this.files()?.splice(this.files().indexOf(file), 1)
  }


  download(file: File) {
    return URL.createObjectURL(file)
  }
}
