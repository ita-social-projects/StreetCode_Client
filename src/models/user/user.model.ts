export default interface User {
    id:number;
    name:string;
    surname:string;
    email:string;
    login:string;
    password:string;
    userRole:UserRole;
}

export interface UserLoginRequest {
    login:string;
    password:string;
}
export interface UserLoginResponce {
    user:User;
    token:string;
    expireAt:Date;
}

export interface RefreshTokenRequest {
    token:string;
}

export interface RefreshTokenResponce {
    token:string;
    expireAt:Date;
}

export enum UserRole {
    MainAdministrator,
    Administrator,
    Moderator,
}
