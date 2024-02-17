export class CreateUserDto {
    constructor(init?: Partial<CreateUserDto>) {
        Object.assign(this, init);
    }
}