import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { SignInDto } from "./signInDto";
import { User } from "./user";

@Injectable()
export class UserService {

    constructor(private httpClient: HttpClient) {
    }

    signIn(signInDto: SignInDto): Observable<User> {
        return this.httpClient.post<User>('http://localhost:3000/users/signin', JSON.stringify(signInDto)).pipe(
            map(data => {
                console.log(data);

                return new User(
                    data.username,
                    data.firstName,
                    data.lastName,
                    data.email
                )
            })
        )
    }

    createUser(user: User): Observable<any> {
        return this.httpClient.post('http://localhost:3000/users', JSON.stringify(user))
    }
}