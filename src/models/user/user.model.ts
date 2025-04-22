import Expertise from '@models/user/expertises/expertise.model';

export default interface User {
    name:string;
    surname:string;
    email:string;
    login:string;
    role: UserRole;
    userName:string;
    aboutYourself: string | null;
    avatarId: number | null;
    expertises: Expertise[];
    phoneNumber: string;
}

export interface UpdateUser {
    name: string;
    surname: string;
    userName: string;
    aboutYourself: string | null;
    avatarId: number | null;
    expertises: Expertise[];
    phoneNumber: string;
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

export interface GoogleLoginRequest {
    idToken: string;
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
