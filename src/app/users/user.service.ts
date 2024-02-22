import { AuthService } from './../shared/auth.service';
import { UserRouteAccessService } from '../shared/user-route-access.service';
import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, map, tap } from "rxjs";
import { SignInDto } from "./signInDto";
import { User } from "./user";
import { UserDto } from "./userDto";
import { environment } from "../../environment";
import { LoggerService } from '../shared/logger.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    
    private baseUrl = environment.BASE_URL

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
        private userRouteAccessService: UserRouteAccessService,
        private logger: LoggerService
    ) { }

    signIn(signInDto: SignInDto): Observable<User> {
        return this.httpClient.post<User>(this.baseUrl + 'users/signin', JSON.stringify(signInDto)).pipe(
            map(data => {
                const user = this.mapUser(data)
                this.authService.userSignal.set(user)
                this.authService.isAdmin.set(user.role === 'ADMIN' ? true : false)
                this.logger.info('in UserService.signIn', user);
                this.userRouteAccessService.isActivated.set(true)
                return user
            })
        )
    }

    createUser(userToCreate: UserDto): Observable<User> {
        return this.httpClient.post<User>(this.baseUrl + 'users', JSON.stringify(userToCreate))
    }
    
    updateUser(userId: string, updateUser: UserDto): Observable<User> {
        return this.httpClient.patch<User>(this.baseUrl + 'users/' + userId, updateUser).pipe(
            map(data => {
                const user = this.mapUser(data)
                this.authService.userSignal.set(user)
                this.logger.info('in UserService.updateUser', user);
                return user
            })
        )
    }

    getUsers(): Observable<User[]> {
      return this.httpClient.get<User[]>(this.baseUrl + 'users')
    }

    deleteUser(userId: string): Observable<User> {
        return this.httpClient.delete<User>(this.baseUrl + 'users/' + userId).pipe(tap(data => {
            this.logger.info('in UserService.deleteUser', data);
        }))
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
            data.rememberMe
        )
    }
}