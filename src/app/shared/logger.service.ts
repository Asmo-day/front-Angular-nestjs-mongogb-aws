import { Injectable, isDevMode } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LoggerService {

    #withDate(template: string): string {
        return `${new Date().toLocaleTimeString()} | ${template}`;
    }

    info(template: string, ...optionalParams: any[]): void {
        if (!isDevMode()) return;
        console.log(`%c------ ${this.#withDate(template)} -------`, 'color: #bada55', ...optionalParams);
    }

    warn(template: string, ...optionalParams: any[]): void {
        if (!isDevMode()) return;
        console.warn(`%c------ ${this.#withDate(template)} -------`, 'color: #db7f00', ...optionalParams);
    }

    error(template: string, ...optionalParams: any[]): void {
        if (!isDevMode()) return;
        console.error(`%c------ ${this.#withDate(template)} -------`, 'color: #db0000', ...optionalParams);
    }
}