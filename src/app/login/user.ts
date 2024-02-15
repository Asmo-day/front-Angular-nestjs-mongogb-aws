export class User {

    username: string
    firstName: string
    lastName: string
    email: string
    password?: string

    constructor(username: string, firstName: string, lastName: string, email: string) {
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
    }

    public static generate(init?: Partial<User>) {
        Object.assign(this, init);
    }
}