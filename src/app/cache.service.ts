import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CacheService {

    set(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data))
    }

    get(key: string): any {
        return JSON.parse(localStorage.getItem(key) || 'null')
    }

    clear(key?: string): void {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear;
        }
    }
}