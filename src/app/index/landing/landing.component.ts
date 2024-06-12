import {Component, ElementRef, Renderer2, signal, viewChild} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../login.service";
import {MailService} from "../../services/resources/mail.service";
import {FlashMessageService} from "../../services/flash-message.service";
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {ValidationsService} from "../../services/validations.service";

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        RouterLink, ReactiveFormsModule, ValidationErrorComponent, LoadingWheelComponent
    ],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css'
})
export class LandingComponent {

    isLoadingMail = signal<boolean>(false)
    isTouchedMail = signal<boolean>(false)
    heroPercentage = signal<number>(100)
    contactForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        subject: ['', Validators.maxLength(100)],
        phone: [''],
        message: ['', [Validators.required, Validators.maxLength(500)]],
    })

    constructor(
        public scrollSvc: ScrollService,
        private router: Router,
        private renderer: Renderer2,
        private formBuilder: FormBuilder,
        public loginSvc: LoginService,
        private mailSvc: MailService,
        public flashMessageSvc: FlashMessageService,
        public validationSvc: ValidationsService,
    ) {
        if (this.loginSvc.isLogged()) {
            this.contactForm.get('email')?.setValue(this.loginSvc.user()?.email ?? '')
            this.contactForm.get('name')?.setValue(this.loginSvc.user()?.name ?? '')
        }

    }

    foto1 = viewChild<ElementRef>('foto1')
    foto2 = viewChild<ElementRef>('foto2')
    text1 = viewChild<ElementRef>('text1')
    text2 = viewChild<ElementRef>('text2')
    heroCircle = viewChild<ElementRef>('heroCircle')
    planHeader = viewChild<ElementRef>('planHeader')
    plan1 = viewChild<ElementRef>('plan1')
    plan2 = viewChild<ElementRef>('plan2')
    plan3 = viewChild<ElementRef>('plan3')
    street = viewChild<ElementRef>('street')
    timeTable = viewChild<ElementRef>('timetable')
    svgLocation = viewChild<ElementRef>('svgLocation')
    locationShadow = viewChild<ElementRef>('locationShadow')
    from = viewChild<ElementRef>('from')
    email = viewChild<ElementRef>('email')
    subject = viewChild<ElementRef>('subject')
    phone = viewChild<ElementRef>('phone')
    message = viewChild<ElementRef>('message')
    nameInput = viewChild<ElementRef>('nameInput')

    ngOnInit() {
        this.scrollSvc.scrollTop.subscribe((scrollTop) => {
            this.firstView(scrollTop)
            this.secondView(scrollTop)
            this.hero(scrollTop)
            this.plans(scrollTop)
            this.location(scrollTop)
            this.contactFormTransition(scrollTop)
            console.log(scrollTop)
        })
    }

    contactFormTransition(scrollTop: number) {
        let breakpoints = [4100, 4350]
        if (window.innerWidth < 850) breakpoints = [6900, 7100]
        if (scrollTop > breakpoints[1]) {
            this.renderer.setStyle(this.subject()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.message()?.nativeElement, 'transform', 'translateY(0)')
            return;
        }
        if (scrollTop > breakpoints[0]) {
            this.renderer.setStyle(this.from()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.email()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.phone()?.nativeElement, 'transform', 'translateX(0)')
            return
        }
        this.renderer.setStyle(this.from()?.nativeElement, 'transform', 'translateX(-110%)')
        this.renderer.setStyle(this.email()?.nativeElement, 'transform', 'translateX(200%)')
        this.renderer.setStyle(this.phone()?.nativeElement, 'transform', 'translateX(-210%)')
        this.renderer.setStyle(this.subject()?.nativeElement, 'transform', 'translateX(110%)')
        this.renderer.setStyle(this.message()?.nativeElement, 'transform', 'translateY(110%)')

    }

    location(scrollTop: number) {
        let breakpoints = [3000, 3250]
        if (window.innerWidth < 850) breakpoints = [5300, 5500]
        if (scrollTop > breakpoints[1]) {
            this.renderer.setStyle(this.street()?.nativeElement, 'transform', 'translateX(0)')
            this.renderer.setStyle(this.timeTable()?.nativeElement, 'transform', 'translateX(0)')
            return
        }
        this.renderer.setStyle(this.street()?.nativeElement, 'transform', 'translateX(200%)')
        this.renderer.setStyle(this.timeTable()?.nativeElement, 'transform', 'translateX(-200%)')

        if (scrollTop > breakpoints[0]) {
            this.renderer.setStyle(this.svgLocation()?.nativeElement, 'transform', 'translateY(0)')
            this.renderer.setStyle(this.locationShadow()?.nativeElement, 'transform', 'scale(100%)')
            return;
        }
        this.renderer.setStyle(this.svgLocation()?.nativeElement, 'transform', 'translateY(-220%)')
        this.renderer.setStyle(this.locationShadow()?.nativeElement, 'transform', 'scale(0)')
    }

    plans(scrollTop: number) {
        let breakpoints = [2100, 2200]
        if (window.innerWidth < 850) breakpoints = [3500, 4000]
        if (scrollTop > breakpoints[1]) {

            this.renderer.setStyle(this.plan1()?.nativeElement, 'transform', 'translateY(0)')
            this.renderer.setStyle(this.plan2()?.nativeElement, 'transform', 'translateY(0)')
            this.renderer.setStyle(this.plan2()?.nativeElement, 'transform', 'scale(105%)')
            this.renderer.setStyle(this.plan2()?.nativeElement, 'opacity', '100%')
            this.renderer.setStyle(this.plan3()?.nativeElement, 'transform', 'translateY(0)')
            this.renderer.setStyle(this.plan3()?.nativeElement, 'transform', 'scale(95%)')
            return;
        }
        this.renderer.setStyle(this.plan1()?.nativeElement, 'transform', 'translateY(100%)')
        this.renderer.setStyle(this.plan2()?.nativeElement, 'transform', 'translateY(-200%)')
        this.renderer.setStyle(this.plan2()?.nativeElement, 'opacity', '0')
        this.renderer.setStyle(this.plan3()?.nativeElement, 'transform', 'translateY(100%)')

        if (scrollTop > breakpoints[0]) {
            this.renderer.setStyle(this.planHeader()?.nativeElement, 'transform', 'translateY(0)')
            this.renderer.setStyle(this.planHeader()?.nativeElement, 'transform', 'scale(100%)')
            return
        }
        this.renderer.setStyle(this.planHeader()?.nativeElement, 'transform', 'translateY(-100%)')
        this.renderer.setStyle(this.planHeader()?.nativeElement, 'transform', 'scale(0)')

    }

    hero(scrollTop: number) {
        let breakpoints = [1800, 2600]
        if (window.innerWidth < 850) breakpoints = [2450, 2800]
        if (scrollTop > breakpoints[1]) return;
        let interval: any
        if (scrollTop > breakpoints[0]) {
            if (this.heroCircle()?.nativeElement.classList.contains('heroAnimation')) {
                return;
            }
            let start = 0
            interval = setInterval(() => {
                this.heroPercentage.set(start++)
                if (this.heroPercentage() === 90) {
                    clearInterval(interval)
                }
            }, 11)
            setTimeout(() => {
                interval.clearInterval()
                this.heroPercentage.set(90)
            }, 1000)
            this.heroCircle()?.nativeElement.classList.add('heroAnimation')
            return
        }
        this.heroPercentage.set(90)
        this.heroCircle()?.nativeElement.classList.remove('heroAnimation')
    }

    secondView(scrollTop: number) {

        if (scrollTop > 1300) {
            this.renderer.setStyle(this.text2()?.nativeElement, 'transform', 'scale(100%)')
            if (window.innerWidth < 850 && scrollTop < 1850)
                return;
            this.renderer.setStyle(this.foto2()?.nativeElement, 'transform', 'scale(100%)')
            return
        }
        console.log(scrollTop)
        this.renderer.setStyle(this.foto2()?.nativeElement, 'transform', 'scale(0)')
        this.renderer.setStyle(this.text2()?.nativeElement, 'transform', 'scale(0)')
    }


    firstView(scrollTop: number) {
        let breakpoints = [600, 1200]
        if (window.innerWidth < 850) breakpoints = [500, 1200]
        if (scrollTop >= breakpoints[1]) return;
        if (scrollTop < breakpoints[0]) {
            this.renderer.setStyle(this.foto1()?.nativeElement, 'transform', 'translateX(-200%)')
            this.renderer.setStyle(this.text1()?.nativeElement, 'transform', 'translateX(200%)')
            return
        }
        this.renderer.setStyle(this.text1()?.nativeElement, 'transform', 'translateX(0)')
        if (window.innerWidth < 850) {
            if (scrollTop < 700) return;
        }
        this.renderer.setStyle(this.foto1()?.nativeElement, 'transform', 'translateX(0)')

    }


    sendEmail(event
                  :
                  SubmitEvent
    ) {
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
