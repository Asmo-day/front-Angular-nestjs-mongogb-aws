import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { environment } from "../../environment";

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    public encrypt(value: string): string {
        const ciphertext = CryptoJS.AES.encrypt(value, environment.CRYPTO_KEY).toString();
        return ciphertext;
    }

    public decrypt(ciphertext: string): string | null {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, environment.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
            return bytes;
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
}