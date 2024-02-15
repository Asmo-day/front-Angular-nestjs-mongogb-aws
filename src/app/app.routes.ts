import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // {
    //     path: 'accueil',
    //     loadComponent: () => import("./app/../app.component").then(module => module.AppComponent),
    //     title: 'Accueil',
    // },
    {
        path: 'email',
        loadComponent: () => import("./email/email.component").then(module => module.EmailComponent),
        title: 'home',
    },
    {
        path: 'login',
        loadComponent: () => import("./login/login.component").then(module => module.LoginComponent),
        title: 'Connexion',
    }
];
