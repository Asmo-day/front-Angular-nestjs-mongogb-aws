export class Token {
    token: string;
    exp: number;
    iat: number;

    constructor(token: string, exp: number, iat: number) {
        this.token = token
        this.exp = exp
        this.iat = iat
    }
}