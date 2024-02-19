import { UserRouteAccessService } from './user-route-access.service';
import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, map } from "rxjs";
import { SignInDto } from "./signInDto";
import { User } from "./user";
import { CreateUserDto } from "./createUserDto";
import { environment } from "../../environment";

@Injectable({ providedIn: 'root' })
export class UserService {

    private baseUrl = environment.BASE_URL

    public userSignal = signal({})
    public userActiveSignal = signal(false)

    constructor(private httpClient: HttpClient, private userRouteAccessService: UserRouteAccessService) { }

    signIn(signInDto: SignInDto): Observable<User> {
        return this.httpClient.post<any>(this.baseUrl + 'users/signin', JSON.stringify(signInDto)).pipe(
            map(data => {
                this.userRouteAccessService.isActivated.set(true)
                const users = new User(
                    data._id,
                    data.username,
                    data.firstName,
                    data.lastName,
                    data.email,
                    data.role
                )
                this.userSignal.set(users)
                return users
            })
        )
    }

    createUser(userToCreate: CreateUserDto): Observable<any> {
        return this.httpClient.post(this.baseUrl + 'users', JSON.stringify(userToCreate))
    }

    deleteUser(username: string): Observable<any> {
        return this.httpClient.delete(this.baseUrl + 'users/' + username)
    }
}