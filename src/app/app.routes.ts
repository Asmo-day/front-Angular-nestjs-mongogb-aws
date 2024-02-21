import { Routes } from '@angular/router';
import { UserRouteAccessService } from './shared/user-route-access.service';

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
        title: 'User',
    },
    {
        path: 'profil',
        canActivate: [UserRouteAccessService],
        loadComponent: () => import("./profil/profil.component").then(module => module.ProfilComponent),
        title: 'Profil',
    },
    {
        path: 'manageUsers',
        canActivate: [UserRouteAccessService],
        loadComponent: () => import("./manage-users/manage-users.component").then(module => module.ManageUsersComponent),
        title: 'Manage Users',
        data: { authorities: ['ADMIN'] }
    }

];
