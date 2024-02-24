import { Roles } from "./roles"

export class User {

    id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: Roles;
    userToken?: string;
    rememberMe?: boolean;
    createDate?: Date;
    lastConnectionDate?: Date;
    userIcon?: string;

    constructor(id?: string, username?: string, firstName?: string, lastName?: string,
        email?: string, role?: Roles, userToken?: string, rememberMe?: boolean,
        createDate?: Date, lastConnectionDate?: Date, userIcon?: string) {
        this.id = id
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.role = role
        this.userToken = userToken
        this.rememberMe = rememberMe
        this.createDate = createDate
        this.lastConnectionDate = lastConnectionDate
        this.userIcon = userIcon
    }
}

export class UserBuilder {
    id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: Roles;
    userToken?: string;
    rememberMe?: boolean;
    createDate?: Date;
    lastConnectionDate?: Date;
    userIcon?: string;
}