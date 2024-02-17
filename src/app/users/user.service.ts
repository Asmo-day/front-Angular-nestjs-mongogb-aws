import { UserRouteAccessService } from './user-route-access.service';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { SignInDto } from "./signInDto";
import { User } from "./user";
import { CreateUserDto } from "./createUserDto";
import { environment } from "../../environment";

@Injectable({ providedIn: 'root' })
export class UserService {

    baseUrl = environment.BASE_URL

    constructor(private httpClient: HttpClient, private userRouteAccessService: UserRouteAccessService) { }

    signIn(signInDto: SignInDto): Observable<User> {
        return this.httpClient.post<User>(this.baseUrl + 'users/signin', JSON.stringify(signInDto)).pipe(
            map(data => {
                this.userRouteAccessService.isActivated.set(true)
                return new User(
                    data.username,
                    data.firstName,
                    data.lastName,
                    data.email,
                    data.role
                )
            })
        )
    }

    createUser(userToCreate: CreateUserDto): Observable<any> {
        return this.httpClient.post(this.baseUrl + 'users', JSON.stringify(userToCreate))
    }
}