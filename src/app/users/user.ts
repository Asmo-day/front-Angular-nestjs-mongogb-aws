import { Roles } from "./roles"

export class User {

    username: string
    firstName: string
    lastName: string
    email: string
    password?: string
    role: Roles

    constructor(username: string, firstName: string, lastName: string, email: string, role: Roles) {
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.role = role
    }
}