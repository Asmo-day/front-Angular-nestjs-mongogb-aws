export class EmailDto {
    public constructor(init?: Partial<EmailDto>) {
        Object.assign(this, init);
    }
}