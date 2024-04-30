import { Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";
import { LoginComponent } from './login/login.component';
import { PostsComponent } from './posts/posts.component';
import { RegisterComponent } from './login/register/register.component';


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
    }

];
