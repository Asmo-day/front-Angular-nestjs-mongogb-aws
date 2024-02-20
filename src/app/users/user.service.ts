import { UserRouteAccessService } from './user-route-access.service';
import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, map } from "rxjs";
import { SignInDto } from "./signInDto";
import { User } from "./user";
import { UserDto } from "./userDto";
import { environment } from "../../environment";

@Injectable({ providedIn: 'root' })
export class UserService {

    private baseUrl = environment.BASE_URL
    public userSignal = signal({})
    public userActiveSignal = signal(false)

    constructor(private httpClient: HttpClient, private userRouteAccessService: UserRouteAccessService) { }

    signIn(signInDto: SignInDto): Observable<User> {
        console.log(signInDto);

        return this.httpClient.post<any>(this.baseUrl + 'users/signin', JSON.stringify(signInDto)).pipe(
            map(data => {
                console.log(data);
                this.userRouteAccessService.isActivated.set(true)
                const users = this.mapUser(data)



                this.userSignal.set(users)
                console.log(this.userSignal());

                return users
            })
        )
    }

    createUser(userToCreate: UserDto): Observable<any> {
        return this.httpClient.post(this.baseUrl + 'users', JSON.stringify(userToCreate))
    }

    updateUser(userId: string, updateUser: UserDto): Observable<User> {
        return this.httpClient.patch<User>(this.baseUrl + 'users/' + userId, updateUser).pipe(
            map(data => {
                const users = this.mapUser(data)
                this.userSignal.set(users)
                return users
            })
        )
    }


    deleteUser(userId: string): Observable<any> {
        return this.httpClient.delete(this.baseUrl + 'users/' + userId)
    }

    mapUser(data: any): User {
        return new User(
            data._id,
            data.username,
            data.firstName,
            data.lastName,
            data.email,
            data.role,
            data.userToken,

        )
    }
}