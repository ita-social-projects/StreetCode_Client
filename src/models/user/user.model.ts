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
    captchaToken: string | null | undefined;
}
export interface UserLoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface UserRegisterRequest {
    name:string;
    surname:string;
    email:string;
    username:string;
    phoneNumber:string;
    password:string;
    passwordConfirmation:string;
}

export interface UserRegisterResponse {

}

export interface RefreshTokenRequest {
    accessToken:string;
    refreshToken:string;
}

export interface RefreshTokenResponce {
    accessToken:string;
}

export enum UserRole {
    Admin,
    User,
}
