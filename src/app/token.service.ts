import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenDto } from "./tokenDto";
import { environment } from "../environment";

@Injectable()
export class TokenService {

    baseUrl = environment.BASE_URL
    apiKey = environment.API_KEY

    httpHeaders = new HttpHeaders({
        'api-key': this.apiKey
    });

    constructor(private httpBackend: HttpBackend) { }

    getToken(): Observable<TokenDto> {
        const httpClientNotIntercept = new HttpClient(this.httpBackend)
        return httpClientNotIntercept.get<TokenDto>(this.baseUrl + 'auth/token', { headers: this.httpHeaders })
    }
}