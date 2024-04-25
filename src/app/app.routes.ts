import { Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";
import { LoginComponent } from './login/login.component';
import { PostsComponent } from './posts/posts.component';


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
      path: 'posts',
      component: PostsComponent
    },
    {
        path : 'login',
        component: LoginComponent
    }

];
