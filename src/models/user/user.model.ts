export default interface User {
    name:string;
    surname:string;
    email:string;
    login:string;
    userRole:UserRole;
}

export interface UserLoginRequest {
    login:string;
    password:string;
}
export interface UserLoginResponse {
    user:User;
    token:string;
}

export interface RefreshTokenRequest {
    token:string;
}

export interface RefreshTokenResponce {
    token:string;
    expireAt:Date;
}

export enum UserRole {
    Admin,
    User,
}
