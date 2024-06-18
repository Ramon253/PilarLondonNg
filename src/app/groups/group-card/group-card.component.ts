import {Component, ElementRef, input, signal, viewChild} from '@angular/core';
import {Group} from "../../models/group";
import {DatePipe} from "@angular/common";
import {LoginService} from "../../login.service";
import {Router, RouterLink} from "@angular/router";
import {GroupService} from "../../services/group.service";
import {environment} from "../../../environments/environment.development";
import {FlashMessageService} from "../../services/flash-message.service";
import {LoadingWheelComponent} from "../../svg/loading-wheel/loading-wheel.component";
import {RoutingService} from "../../services/routing.service";
import {DialogComponent} from "../../dialog/dialog.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationErrorComponent} from "../../validations/validation-error/validation-error.component";
import {StudentService} from "../../services/student.service";

@Component({
    selector: 'app-group-card',
    standalone: true,
    imports: [
        RouterLink,
        LoadingWheelComponent,
        DialogComponent,
        ReactiveFormsModule,
        ValidationErrorComponent
    ],
    templateUrl: './group-card.component.html',
    styleUrl: './group-card.component.css'
})
export class GroupCardComponent {
    capacity = viewChild<ElementRef>('capacity')
    group = input.required<Group>()
    isLoadingWait = signal<boolean>(false)
    showJoinDialog = signal<boolean>(false)
    joinWaitlistForm = this.formBuilder.group({
        phone_number : ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        places : [1, [Validators.required, Validators.minLength(0), Validators.max(4)]],
    })
    public isLoadingVerify = signal(false);
    public showVerifyEmail = signal(false);

    constructor(
        public datePipe: DatePipe,
        public loginSvc: LoginService,
        public groupSvc: GroupService,
        private router: Router,
        private messageSvc : FlashMessageService,
        private routingSvc : RoutingService,
        private formBuilder: FormBuilder,
        private studentSvc : StudentService
    ) {
    }

    onClick() {
        if (!this.loginSvc.isLogged() || this.loginSvc.user()?.role === 'none')
            return;
        this.router.navigate(['/group/' + this.group().id]);
    }

    showDays() {
        switch (this.group().lesson_days) {
            case 'l-m' : {
                return 'Lunes y miercoles'
            }
            case 'm-j' : {
                return 'Martes y jueves'
            }
            case 'v' : {
                return 'Viernes'
            }
        }
        return 'null'
    }

    verifyEmail(codeInput: HTMLInputElement) {
        this.isLoadingVerify.set(true)
        this.studentSvc.verify(codeInput.value).then(
            res => {
                this.showVerifyEmail.set(false)
                this.isLoadingVerify.set(false)
            }
        )
    }
    joinWaitlist(event : SubmitEvent) {

        if (!this.loginSvc.isLogged()){
            this.router.navigate(['/login'])
            this.routingSvc.intended.set('/groups')
            this.messageSvc.messages().push({
                message : 'Necesitas tener cuenta para unirte a la lista de espera',
                type : 'error',
                duration : 10
            })
        }
        if (this.loginSvc.user()?.email_verified_at === null){
            this.showVerifyEmail.set(true)
            this.loginSvc.isVerified().then((result) => {
                this.messageSvc.messages().push({
                    message : 'Tu email ya estaba verificado',
                    type : 'error',
                    duration : 10
                })
                this.showVerifyEmail.set(false)
            }).catch((err) => {
                this.messageSvc.messages().push({
                    message : 'Ya se te ha mandado el email',
                    type : 'message',
                    duration : 10
                })
            }).finally(() => {
                this.showJoinDialog.set(false)
            }) ;
            return
        }
        this.isLoadingWait.set(true)
        this.groupSvc.joinWaitList(this.group().id ?? '', this.joinWaitlistForm.getRawValue()).then(
            (res) => {
                this.group().inWaitlist = true
                this.messageSvc.messages().push({
                    message : 'Te has unido a la lista de espera',
                    type : 'message',
                    duration : 5
                })
            }).catch((e) => {
                this.messageSvc.messages().push({
                    message : 'Ha habido un problema al unirse a la lista de espera',
                    type : 'error',
                    duration : 10
                })
        }).finally(() => {
            this.isLoadingWait.set(false)
            this.showJoinDialog.set(false)
        }) ;
    }

    ngOnInit() {
        this.capacity()?.nativeElement.classList.add(this.group().capacity ?? 1 < (this.group().studentNumber ?? 1) ? 'text-dark-font' : 'text-secondary')
    }

    protected readonly environment = environment;
    protected readonly onclick = onclick;
}
