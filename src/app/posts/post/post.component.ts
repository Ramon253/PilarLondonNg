import {Component, signal} from '@angular/core';
import {PostService} from "../../services/post.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Post} from "../../models/post";
import {DatePipe} from "@angular/common";
import {popResultSelector} from "rxjs/internal/util/args";

@Component({
  selector: 'app-post',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

    post = signal<Post>({
        name : '',
        subject : '',
        description : '',
        group_id : ''
    } as Post)


    ngOnInit() {
        this.route.params.subscribe(
            params => {

                this.postSvc.getPost(params['post']).subscribe(
                    post => {
                        console.log(post)
                        post.created_at = this.datePipe.transform(post.created_at, 'HH:mm dd/MM/yyyy') ?? ''
                        this.post.set(post as Post)
                    }
                )
            }
        )
    }
    constructor(
        private postSvc : PostService,
        private route : ActivatedRoute,
        private  datePipe : DatePipe) {
    }

    protected readonly popResultSelector = popResultSelector;
}
