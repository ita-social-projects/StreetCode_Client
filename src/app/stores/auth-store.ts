/* eslint-disable no-restricted-imports */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import { action, makeObservable, observable } from 'mobx';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import User, { RefreshTokenRequest, UserLoginResponse } from '@/models/user/user.model';

import AuthApi from '../api/authentication/auth.api';

export default class AuthStore {
    public user?: User = undefined;

    private static accessTokenStorageName = 'AccessToken';

    private static refreshTokenStorageName = 'RefreshToken';

    public constructor() {
        makeObservable(this, {
            user: observable,
            login: action,
            refreshToken: action,
            logout: action,
        });
    }

    public static getAccessToken() {
        return localStorage.getItem(this.accessTokenStorageName);
    }

    public static getRefreshToken() {
        return localStorage.getItem(this.refreshTokenStorageName);
    }

    public static isLoggedIn(): boolean {
        const token = localStorage.getItem(AuthStore.accessTokenStorageName);
        if (!this.isAccessTokenHasValidSignature(token) || !this.isAccessTokenExpired(token!)) {
            return false;
        }

        return true;
    }

    public static isRefreshTokenExists(): boolean {
        return !!AuthStore.getRefreshToken();
    }

    public logout() {
        this.clearData();
    }

    public async login(
        login: string,
        password: string,
        captchaToken: string | null | undefined,
    ) {
        await AuthApi.login({ login, password, captchaToken })
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
        const token = AuthStore.getAccessToken();
        if (!AuthStore.isAccessTokenHasValidSignature(token)) {
            const error = new Error('Invalid sigrature of access token');
            console.log('hello');
            return Promise.reject(error);
        }

        if (!AuthStore.isRefreshTokenExists()) {
            const error = new Error('Refresh token doesn`t exists');
            return Promise.reject(error);
        }

        const refreshTokenRequest: RefreshTokenRequest = {
            accessToken: AuthStore.getAccessToken() || '',
            refreshToken: AuthStore.getRefreshToken() || '',
        };

        return AuthApi.refreshToken(refreshTokenRequest)
            .then((refreshToken) => {
                this.setAccessToken(refreshToken.accessToken);
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    };

    private setAccessToken(newToken: string) {
        localStorage.setItem(AuthStore.accessTokenStorageName, newToken);
    }

    private setRefreshToken(newToken:string) {
        localStorage.setItem(AuthStore.refreshTokenStorageName, newToken);
    }

    private clearData() {
        this.clearAccessToken();
        this.clearRefreshToken();
        this.setUser(undefined);
    }

    private clearAccessToken() {
        localStorage.removeItem(AuthStore.accessTokenStorageName);
    }

    private clearRefreshToken() {
        localStorage.removeItem(AuthStore.refreshTokenStorageName);
    }

    private static isAccessTokenExpired(token: string): boolean {
        const decodedToken = this.getDecodedAccessToken(token);
        const expirationTime = ((decodedToken && decodedToken?.exp) || 0) * 1000;
        const actualTime = new Date().getTime();

        return expirationTime <= actualTime;
    }

    private static isAccessTokenHasValidSignature(token: string | null) {
        return token && !!AuthStore.getDecodedAccessToken(token);
    }

    private static getDecodedAccessToken(token: string): JwtPayload | null {
        let decodedToken: JwtPayload | null = null;
        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            return null;
        }

        return decodedToken;
    }

    private setUser(newUser: User | undefined) {
        this.user = newUser;
    }
}
