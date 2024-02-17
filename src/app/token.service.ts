import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, tap } from "rxjs";
import { Token } from "./token";
import { environment } from "../environment";
import { CacheService } from "./cache.service";

@Injectable()
export class TokenService {

    baseUrl = environment.BASE_URL
    apiKey = environment.API_KEY

    httpHeaders = new HttpHeaders({
        'api-key': this.apiKey
    });

    constructor(private httpBackend: HttpBackend, private cacheService: CacheService) { }

    getToken(): Observable<Token> {
        const httpClientNotIntercept = new HttpClient(this.httpBackend)
        return httpClientNotIntercept.get<Token>(this.baseUrl + 'auth/token', { headers: this.httpHeaders }).pipe(
            map(data => {
                const tokenIatExp = JSON.parse(window.atob(data.token.split('.')[1]))
                const newToken = new Token(data.token, tokenIatExp.exp, tokenIatExp.iat)
                this.cacheService.set('token', newToken)
                return newToken
            }))
    }
}