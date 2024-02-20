export class UserDto {
    constructor(init?: Partial<UserDto>) {
        Object.assign(this, init);
    }
}