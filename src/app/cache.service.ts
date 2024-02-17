import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CacheService {

    private cache: { [key: string]: any } = {};

    set(key: string, data: any): void {
        this.cache[key] = data;
    }

    get(key: string): any {
        return this.cache[key];
    }

    has(key: string): boolean {
        return !!this.cache[key];
    }

    clear(key?: string): void {
        if (key) {
            delete this.cache[key];
        } else {
            this.cache = {};
        }
    }
}