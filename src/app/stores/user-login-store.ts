/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import { action, computed, makeObservable, observable } from 'mobx';
import UserApi from '@api/user/user.api';
import { jwtDecode } from 'jwt-decode';

import User, { RefreshTokenRequest, UserLoginResponse } from '@/models/user/user.model';

export default class UserLoginStore {
    private static accessTokenStorageName = 'AccessToken';

    private static refreshTokenStorageName = 'RefreshToken';

    public user?: User = undefined;

    public constructor() {
        makeObservable(this, {
            user: observable,
            login: action,
            isAccessTokenValid: computed,
        });
    }

    public get isAccessTokenValid(): boolean {
        const token = localStorage.getItem(UserLoginStore.accessTokenStorageName) ?? '';
        const decodedToken = token && jwtDecode(token);
        console.log(decodedToken);
        const expirationTime = ((decodedToken && decodedToken?.exp) || 0) * 1000;
        const actualTime = new Date().getTime();

        return actualTime < expirationTime;
    }

    private setUser(newUser: User | undefined) {
        this.user = newUser;
    }

    public static getAccessToken() {
        return localStorage.getItem(this.accessTokenStorageName);
    }

    private setAccessToken(newToken: string) {
        localStorage.setItem(UserLoginStore.accessTokenStorageName, newToken);
    }

    private clearAccessToken() {
        localStorage.removeItem(UserLoginStore.accessTokenStorageName);
    }

    public static getRefreshToken() {
        return localStorage.getItem(this.refreshTokenStorageName);
    }

    private setRefreshToken(newToken:string) {
        localStorage.setItem(UserLoginStore.refreshTokenStorageName, newToken);
    }

    private clearRefreshToken() {
        localStorage.removeItem(UserLoginStore.refreshTokenStorageName);
    }

    private clearData() {
        this.clearAccessToken();
        this.setUser(undefined);
    }

    public logout() {
        this.clearData();
    }

    public async login(login: string, password: string) {
        await UserApi.login({ login, password })
            .then((response: UserLoginResponse) => {
                this.clearAccessToken();
                this.clearRefreshToken();

                this.setAccessToken(response.accessToken);
                this.setRefreshToken(response.refreshToken);
                this.setUser(response.user);
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    }

    public refreshToken = () => {
        const refreshTokenRequest: RefreshTokenRequest = {
            accessToken: UserLoginStore.getAccessToken() || '',
            refreshToken: UserLoginStore.getRefreshToken() || '',
        };

        return UserApi.refreshToken(refreshTokenRequest)
            .then((refreshToken) => {
                this.setAccessToken(refreshToken.accessToken);
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    };
}
