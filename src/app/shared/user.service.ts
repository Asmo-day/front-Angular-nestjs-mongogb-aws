import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { UserRouteAccessService } from './user-route-access.service';
import { HttpClient } from "@angular/common/http";
import { Injectable, effect, signal } from "@angular/core";
import { Observable, map, tap } from "rxjs";
import { User } from "../users/user";
import { UserDto } from "../users/userDto";
import { environment } from "../../environment";
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class UserService {

    private baseUrl = environment.BASE_URL;

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
        private userRouteAccessService: UserRouteAccessService,
        private logger: LoggerService
    ) { }

    signIn(userDto: UserDto): Observable<User> {
        return this.httpClient.post<User>(this.baseUrl + 'users/signin', JSON.stringify(userDto)).pipe(
            map(data => {
                const user = this.mapUser(data)
                if (user.isValidatedAccount) {
                    this.authService.userSignal.set(user)
                    this.authService.isAdmin.set(user.role === 'ADMIN' ? true : false)
                    this.logger.info('in UserService.signIn', user);
                    this.userRouteAccessService.isActivated.set(true)
                    return user
                } else {
                    this.logger.warn('in UserService.signIn', 'User account not validated', user);
                    return user
                }
            })
        )
    }

    validateUser(id: string, token: string): Observable<any> {
        return this.httpClient.get(this.baseUrl + 'users/validation?id=' + id + '&token=' + token)
    }

    createUser(userToCreate: UserDto): Observable<any> {
        return this.httpClient.post<User>(this.baseUrl + 'users', JSON.stringify(userToCreate))
    }

    updateUserIcon(id: string, icon: any) {
        let formdata = new FormData()
        formdata.append('image', icon)
        return this.httpClient.post(this.baseUrl + 'users/' + id, formdata)
    }

    updateUserPassword(id: string, updateUserPass: UserDto) {
        return this.httpClient.post(this.baseUrl + 'users/password/' + id, updateUserPass)
    }

    updateUser(userId: string, updateUser: any): Observable<User> {
        return this.httpClient.patch<User>(this.baseUrl + 'users/' + userId, updateUser).pipe(
            map(data => {
                const user = this.mapUser(data)
                // compare IDs before updating the user allows ADMIN to update its own profile
                if (this.authService.userSignal().id === userId) {
                    this.authService.userSignal.set(user)
                }
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
            data.rememberMe,
            data.createDate,
            data.lastConnectionDate,
            data.userIcon,
            data.isValidatedAccount,
            data.isAllowCookies
        )
    }
}