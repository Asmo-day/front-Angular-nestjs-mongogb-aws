import { Injectable, signal } from "@angular/core";
import { User } from "../users/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public userSignal = signal<User>({});
    public userActiveSignal = signal(false);
    public isAdmin = signal(false);

}