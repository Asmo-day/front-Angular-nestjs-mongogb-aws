import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    {
        path: 'accueil',
        loadComponent: () => import("./app/../app.component").then(module => module.AppComponent),
        title: 'Accueil',
    },
    {
        path: 'login',
        loadComponent: () => import("./app/../login/login.component").then(module => module.LoginComponent),
        title: 'Connexion',
    }
];
