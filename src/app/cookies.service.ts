import { Injectable, inject } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { environment } from "../environment";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
})
export class CookiesService {

    private cookieService = inject(CookieService)

    set(key: string, value: any) {
        this.cookieService.set('user', this.encryptCookie(JSON.stringify(value)))
    }

    get(key: string) {
        const cookie = this.cookieService.get(key)
        return JSON.parse(this.decryptCookie(cookie) || 'null')
    }

    deleteCookie(key: string) {
        this.cookieService.delete(key)
    }

    private encryptCookie(value: string): string {
        const ciphertext = CryptoJS.AES.encrypt(value, environment.CRYPTO_KEY).toString();
        return ciphertext;
    }

    private decryptCookie(ciphertext: string): string | null {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, environment.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
            return bytes;
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
}