/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import { action, computed, makeObservable, observable } from 'mobx';
import UserApi from '@api/user/user.api';
import { jwtDecode } from 'jwt-decode';

import User, { UserLoginResponse } from '@/models/user/user.model';

export default class UserLoginStore {
    private static tokenStorageName = 'token';

    public user?: User = undefined;

    public constructor() {
        makeObservable(this, {
            user: observable,
            login: action,
            isLoggedIn: computed,
        });
    }

    public get isLoggedIn(): boolean {
        const token = localStorage.getItem(UserLoginStore.tokenStorageName) ?? '';
        const decodedToken = token && jwtDecode(token);
        console.log(decodedToken);
        const expirationTime = ((decodedToken && decodedToken?.exp) || 0) * 1000;
        const actualTime = new Date().getTime();

        return actualTime < expirationTime;
    }

    private setUser(newUser: User) {
        this.user = newUser;
    }

    public static getToken() {
        return localStorage.getItem(this.tokenStorageName);
    }

    private setToken(newToken:string) {
        return localStorage.setItem(UserLoginStore.tokenStorageName, newToken);
    }

    private static clearToken() {
        localStorage.removeItem(this.tokenStorageName);
    }

    // public clearUserData() {
    //     if (this.timeoutHandler) {
    //         clearTimeout(this.timeoutHandler);
    //     }
    //     localStorage.removeItem(UserLoginStore.tokenStorageName);
    //     localStorage.removeItem(UserLoginStore.dateStorageName);
    // }

    // public logout() {
    //     this.clearUserData();
    // }

    // public setUserLoginResponce(user:UserLoginResponce) {
    //     try {
    //         const timeNumber = (new Date(user.expireAt)).getTime();
    //         UserLoginStore.setExpiredDate(timeNumber.toString());
    //         const expireForSeconds = timeNumber - new Date().getTime();
    //         this.userLoginResponce = user;
    //         UserLoginStore.setToken(user.token);
    //         if (expireForSeconds > 10000) {
    //             this.timeoutHandler = setTimeout(() => {
    //                 if (this.callback) {
    //                     this.callback();
    //                 }
    //             }, expireForSeconds - 10000);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    public async login(login: string, password: string) {
        await UserApi.login({ login, password })
            .then((response: UserLoginResponse) => {
                UserLoginStore.clearToken();
                this.setToken(response.token);
                this.setUser(response.user);
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    }
    // public refreshToken = ():Promise<RefreshTokenResponce> => (
    //     UserApi.refreshToken({ token: UserLoginStore.getToken() ?? '' })
    //         .then((refreshToken) => {
    //             const expireForSeconds = (new Date(refreshToken.expireAt)).getTime() - new Date().getTime();
    //             this.timeoutHandler = setTimeout(() => {
    //                 if (this.callback) {
    //                     this.callback();
    //                 }
    //             }, expireForSeconds);
    //             UserLoginStore.setExpiredDate((new Date(refreshToken.expireAt)).getTime().toString());
    //             UserLoginStore.setToken(refreshToken.token);
    //             return refreshToken;
    //         }));
}
