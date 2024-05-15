import { Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";
import { LoginComponent } from './login/login.component';
import { PostsComponent } from './posts/posts.component';
import { RegisterComponent } from './login/register/register.component';
import {PostCardComponent} from "./posts/post-card/post-card.component";
import {PostComponent} from "./posts/post/post.component";
import { AssignmentComponent } from './assignments/assignment/assignment.component';


export const routes: Routes = [
    {
        path : "",
        component : IndexComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: 'register',
        component : RegisterComponent
    },
    {
      path: 'posts',
      component: PostsComponent
    },
    {
        path : 'login',
        component: LoginComponent
    },
    {
        path : 'post/:post',
        component : PostComponent
    },
    {
        path : 'assignment/:assignment',
        component : AssignmentComponent
    }

];
