import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { PostComponent } from './post/post.component';
import { PostCreationFormComponent } from './post/post-creation-form/post-creation-form.component';

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
      children: [
        {
            path: 'create',
            component: PostCreationFormComponent
        }
      ]
    },
    {
        path: "test",
        component: PostComponent
    },

];
