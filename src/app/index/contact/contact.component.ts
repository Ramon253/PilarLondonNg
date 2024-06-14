import {Component, ElementRef, Renderer2, signal, viewChild} from '@angular/core';
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";
import {FlashMessageService} from "../../services/flash-message.service";
import {MailService} from "../../services/resources/mail.service";
import {ValidationsService} from "../../services/validations.service";

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [
        LoadingWheelComponent,
        ReactiveFormsModule,
        ValidationErrorComponent
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.css'
})
export class ContactComponent {
    isLoadingMail = signal<boolean>(false)

    constructor(
        public flashMessageSvc: FlashMessageService,
        private formBuilder: FormBuilder,
        private mailSvc: MailService,
        public validationSvc: ValidationsService,
        private renderer: Renderer2
    ) {
    }

    from = viewChild<ElementRef>('from')
    email = viewChild<ElementRef>('email')
    subject = viewChild<ElementRef>('subject')
    phone = viewChild<ElementRef>('phone')
    message = viewChild<ElementRef>('message')
    nameInput = viewChild<ElementRef>('nameInput')
    header = viewChild<ElementRef>('header')

    contactForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        subject: ['', Validators.maxLength(100)],
        phone: [''],
        message: ['', [Validators.required, Validators.maxLength(500)]],
    })

    ngOnInit() {
        this.renderer.setStyle(this.from()?.nativeElement, 'transform', 'translateX(-110%)')
        this.renderer.setStyle(this.email()?.nativeElement, 'transform', 'translateX(200%)')
        this.renderer.setStyle(this.phone()?.nativeElement, 'transform', 'translateX(-210%)')
        this.renderer.setStyle(this.subject()?.nativeElement, 'transform', 'translateX(110%)')
        this.renderer.setStyle(this.message()?.nativeElement, 'transform', 'translateY(110%)')
        this.header()?.nativeElement.scrollIntoView(false)
        setTimeout(() => {
            this.renderer.setStyle(this.from()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.email()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.phone()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.subject()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.message()?.nativeElement, 'transform', 'translateY(0)')
        }, 100)
    }

    sendEmail(event: SubmitEvent) {
        event.preventDefault()
        if (this.contactForm.invalid) return
        this.isLoadingMail.set(true)
        this.mailSvc.sendContact(this.contactForm.getRawValue()).then(
            res => {
                this.flashMessageSvc.messages().push({
                    message: '<div class="flex items-center gap-2"><span class="material-icons">mail</span> Email enviado con exito</div>',
                    type: 'message',
                    duration: 10
                })
                this.contactForm.reset()
            }
        ).catch(
            err => {
                if (err.status === 401) {
                    this.flashMessageSvc.messages().push({
                        message: '<span class="text-7xl">You need to be logged in</span>',
                        type: 'error',
                        duration: 10
                    })
                }
            }
        ).finally(() => {
            this.isLoadingMail.set(false)
        });
    }

    protected readonly navigator = navigator;
}
