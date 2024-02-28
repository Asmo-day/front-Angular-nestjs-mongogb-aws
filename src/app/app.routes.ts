import { Routes, UrlSegment } from '@angular/router';
import { UserRouteAccessService } from './shared/user-route-access.service';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import("./home/home.component").then(module => module.HomeComponent),
        title: 'Accueil',
    },
    {
        path: 'email',
        canActivate: [UserRouteAccessService],
        loadComponent: () => import("./email/email.component").then(module => module.EmailComponent),
        title: 'Contact',
    },
    {
        path: 'user',
        loadComponent: () => import("./users/user.component").then(module => module.UserComponent),
        title: 'Connexion',
    },
    {
        path: 'profil',
        canActivate: [UserRouteAccessService],
        loadComponent: () => import("./users/profil/profil.component").then(module => module.ProfilComponent),
        title: 'Profile',
    },
    {
        path: 'usersManagement',
        canActivate: [UserRouteAccessService],
        loadComponent: () => import("./users/users-management/users-management.component").then(module => module.UsersManagementComponent),
        title: 'Gestion des Utilisateurs',
        data: { authorities: ['ADMIN'] }
    },
    {
        matcher: (url) => {
            if (url.length === 1 && url[0].path.match(/^@[\w]+@[\w]+.+[\w]+$/gm)) {
                return {
                    consumed: url,
                    posParams: {
                        data: new UrlSegment(url[0].path.slice(1), {})
                    }
                };
            }
            return null;
        },
        loadComponent: () => import("./users/user-validation/user-validation.component").then(module => module.UserValidationComponent),
    },
];
