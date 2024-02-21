import { Injectable, inject, signal } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable()
export class UserRouteAccessService {

    public isActivated = signal(false);
    public isAdmin = signal(false);
    public authService = inject(AuthService)
    private userSignal: any = this.authService.userSignal

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const authorities = route.data['authorities']
        if ((authorities ?? '') && route.data['authorities'].includes(this.userSignal().role)) {
            return true
        }

        return this.isActivated();
    }
}