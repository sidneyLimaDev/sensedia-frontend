/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    city: string;
    days_of_week?: string[];
    posts?: any[];
    albums?: any[];
}
export interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
}
