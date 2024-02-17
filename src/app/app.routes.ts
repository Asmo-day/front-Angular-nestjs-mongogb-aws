import { Routes } from '@angular/router';
import { UserRouteAccessService } from './users/user-route-access.service';

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
        path: 'user',
        loadComponent: () => import("./users/user.component").then(module => module.UserComponent),
        title: 'user',
    },
    {
        path: 'profil',
        loadComponent: () => import("./profil/profil.component").then(module => module.ProfilComponent),
        title: 'profil',
    }
];
