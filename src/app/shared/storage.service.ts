import { Injectable, inject } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    
    private cryptoService = inject(CryptoService)

    set(key: string, data: any): void {
        localStorage.setItem(key, this.cryptoService.encrypt(JSON.stringify(data)))
    }

    get(key: string) {
        const value = localStorage.getItem(key) || 'null'
        return JSON.parse(this.cryptoService.decrypt(value) || 'null')
    }

    clear(key?: string): void {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear;
        }
    }
}