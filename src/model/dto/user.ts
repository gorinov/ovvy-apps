export class User {
    id: number;
    name: string = '';
    password: string;
    email: string = '';
    message: string;
    token: string;

    newPassword: string;
    oldPassword: string;

    date?: Date;

    constructor() {
    }
}