import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, tap } from "rxjs";
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

    getToken(): Observable<any> {
        const httpClientNotIntercept = new HttpClient(this.httpBackend)
        return httpClientNotIntercept.get<any>(this.baseUrl + 'auth/token', { headers: this.httpHeaders }).pipe(
            map(data => {
                this.cacheService.set('token', data.token)
                return data.token
            }))
    }
}