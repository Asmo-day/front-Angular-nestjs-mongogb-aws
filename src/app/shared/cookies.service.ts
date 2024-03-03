import { Injectable, effect, inject, signal } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { CryptoService } from "./crypto.service";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class CookiesService {

    private cookieService = inject(CookieService)
    private cryptoService = inject(CryptoService)
    private storageService = inject(StorageService)
    public cookiesAllowed = signal('');

    constructor() {
        effect(() => {
            if (this.cookiesAllowed()) {
                this.storageService.set('cookiesAllowed', this.cookiesAllowed())
            }
        })
    }

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