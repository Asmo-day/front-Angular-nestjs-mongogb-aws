import { UserRouteAccessService } from './user-route-access.service';
import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { SignInDto } from "./signInDto";
import { User } from "./user";
import { CreateUserDto } from "./createUserDto";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private httpClient: HttpClient, private userRouteAccessService: UserRouteAccessService) { }

    signIn(signInDto: SignInDto): Observable<User> {
        this.userRouteAccessService.isActivated.set(true)
        return this.httpClient.post<User>('http://localhost:3000/users/signin', JSON.stringify(signInDto)).pipe(
            map(data => {
                return new User(
                    data.username,
                    data.firstName,
                    data.lastName,
                    data.email
                )
            })
        )
    }

    createUser(userToCreate: CreateUserDto): Observable<any> {
        return this.httpClient.post('http://localhost:3000/users', JSON.stringify(userToCreate))
    }
}