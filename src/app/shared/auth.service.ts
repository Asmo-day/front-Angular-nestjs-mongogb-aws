import { Injectable, signal } from "@angular/core";
import { UserDto } from "../users/userDto";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public userSignal = signal<UserDto>({});
    public userActiveSignal = signal(false);
    public isAdmin = signal(false);

}