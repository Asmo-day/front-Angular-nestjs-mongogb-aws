import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenDto } from "./tokenDto";

@Injectable()
export class TokenService {

    httpHeaders = new HttpHeaders({
        'api-key': '85e85d0a6efdf600eb89fc401a023c8d5dec650cf73a96549ffc0f9f0b00b312'
    });

    constructor(private httpBackend: HttpBackend) { }

    getToken(): Observable<TokenDto> {
        const httpClientNotIntercept = new HttpClient(this.httpBackend)
        return httpClientNotIntercept.get<TokenDto>("http://localhost:3000/auth/token", { headers: this.httpHeaders })
    }
}