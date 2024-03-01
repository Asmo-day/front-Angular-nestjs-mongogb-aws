import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: ('root')
})

export class InfoBarService {

    public triggerInfoBar = signal<IInfoBar>(new InfoBar());

    generateSimpleInfoBar(message: string) {
        this.buildInfoBar(new InfoBarBuilder(message))
    }

    buildInfoBar(infoBar: InfoBarBuilder) {
        this.triggerInfoBar.set(infoBar.build());
        console.log(this.triggerInfoBar());
        setTimeout(() => {
            this.triggerInfoBar.set(new InfoBar({ hide: true }));
        }, this.triggerInfoBar().duration);
    }

}

export interface IInfoBar {
    message: string;
    duration: number;
    hide: boolean;
    width: string;
    height: string;
    type: Type;
    icon: string;
    isButtons?: boolean
}

export class InfoBar implements IInfoBar {

    public constructor(init?: Partial<InfoBar>) {
        Object.assign(this, init);
    }

    message!: string;
    duration!: number;
    hide: boolean = false;
    width!: string;
    height!: string;
    type!: Type;
    icon!: string
    isButtons?: boolean = false
}

export class InfoBarBuilder {

    private message!: string;
    private duration: number = 3000
    private width: string = '400px'
    private height: string = '60px'
    private type: Type = Type.MESSAGE
    private icon!: string
    isButtons?: boolean

    public constructor(message: string) {
        this.message = message;
    }

    withDuration(duration: number) {
        this.duration = duration
        return this;
    }
    withWidth(width: string) {
        this.width = width
        return this;
    }
    withHeight(height: string) {
        this.height = height
        return this;
    }
    withType(type: Type) {
        this.type = type
        return this;
    }
    withIcon(icon: string) {
        this.icon = icon
        return this;
    }
    withButtons(isButtons: boolean) {
        this.isButtons = isButtons
        return this;
    }
    build(): IInfoBar {
        return new InfoBar({ message: this.message, duration: this.duration, width: this.width, height: this.height, type: this.type, icon: this.icon, isButtons: this.isButtons })
    }

}

export enum Type {
    MESSAGE = 'MESSAGE',
    WARNING = 'WARNING'
}