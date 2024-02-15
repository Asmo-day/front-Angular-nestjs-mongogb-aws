export class SignInDto {
    public constructor(init?: Partial<SignInDto>) {
        Object.assign(this, init);
    }
}