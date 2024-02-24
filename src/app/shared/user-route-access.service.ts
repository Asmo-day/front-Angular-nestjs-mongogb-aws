import { Injectable, inject, signal } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable()
export class UserRouteAccessService {

    public isActivated = signal(false);
    public authService = inject(AuthService)

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const authorities = route.data['authorities']
        if ((authorities ?? '') && route.data['authorities'].includes(this.authService.userSignal().role)) {
            return true
        }

        return this.isActivated();
    }
}