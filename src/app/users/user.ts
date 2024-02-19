import { signal } from "@angular/core"
import { Roles } from "./roles"

export class User {

    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    password?: string
    role: Roles

    constructor(id: string, username: string, firstName: string, lastName: string, email: string, role: Roles) {
        this.id = id
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.role = role
    }
}