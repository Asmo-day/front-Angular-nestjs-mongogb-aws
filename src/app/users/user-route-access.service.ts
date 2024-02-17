import { Injectable, signal } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class UserRouteAccessService {

    public isActivated = signal(false);

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.isActivated();

    }
}