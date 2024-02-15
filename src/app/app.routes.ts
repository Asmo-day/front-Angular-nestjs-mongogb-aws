import { Routes } from '@angular/router';
import { UserRouteAccessService } from './login/user-route-access.service';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import("./home/home.component").then(module => module.HomeComponent),
        title: 'home',
    },
    {
        path: 'email',
        canActivate: [UserRouteAccessService],
        loadComponent: () => import("./email/email.component").then(module => module.EmailComponent),
        title: 'email',
    },
    {
        path: 'login',
        loadComponent: () => import("./login/login.component").then(module => module.LoginComponent),
        title: 'login',
    }
];
