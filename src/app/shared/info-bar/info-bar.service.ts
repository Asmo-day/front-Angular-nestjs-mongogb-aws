import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: ('root')
})

export class InfoBarService {

    public triggerInfoBar = signal<IInfoBar>(new InfoBar());

    generateInfoBar(message: string, duration?: number, width?: string, height?: string) {

        this.triggerInfoBar.set(new InfoBarBuilder( message).withDuration(duration).withWidth(width).withHeight(height));
        console.log(this.triggerInfoBar());
        setTimeout(() => {
            this.triggerInfoBar.set(new InfoBar({ hide: true }));
        }, this.triggerInfoBar().duration);
    }

}

export interface IInfoBar {
    message: string;
    duration?: number;
    hide: boolean;
    width?: string;
    height?: string
}

export class InfoBar implements IInfoBar {

    public constructor(init?: Partial<InfoBar>) {
        Object.assign(this, init);
    }

    message: string = '';
    duration?: number;
    hide: boolean = false;
    width?: string;
    height?: string;
}

export class InfoBarBuilder extends InfoBar {

    public constructor(message: string) {
        super({ message });
    }

    withDuration(duration?: number) {
        this.duration = duration ? duration : 3000
        return this;
    }
    withWidth(width?: string) {
        this.width = width ? width : '500px'
        return this;
    }
    withHeight(height?: string) {
        this.height = height ? height : '100px'
        return this;
    }
}