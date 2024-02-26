import { Injectable, inject } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { environment } from "../../environment";
import { CookieService } from "ngx-cookie-service";
import { CryptoService } from "./crypto.service";

@Injectable({
    providedIn: 'root'
})
export class CookiesService {

    private cookieService = inject(CookieService)
    private cryptoService = inject(CryptoService)

    set(key: string, value: any): void {
        this.cookieService.set(key, this.cryptoService.encrypt(JSON.stringify(value)))
    }

    get(key: string) {
        const cookie = this.cookieService.get(key)
        return JSON.parse(this.cryptoService.decrypt(cookie) || 'null')
    }

    deleteCookie(key: string) {
        this.cookieService.delete(key)
    }
}