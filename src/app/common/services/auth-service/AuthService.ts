/* eslint-disable class-methods-use-this */
import { jwtDecode, JwtPayload } from 'jwt-decode';

import AuthApi from '@/app/api/authentication/auth.api';
import { RefreshTokenRequest } from '@/models/user/user.model';

export default class AuthService {
    private static accessTokenStorageName = 'AccessToken';

    private static refreshTokenStorageName = 'RefreshToken';

    public static getAccessToken() {
        return localStorage.getItem(this.accessTokenStorageName);
    }

    public static isLoggedIn(): boolean {
        const token = this.getAccessToken();
        if (!this.isAccessTokenHasValidSignature(token) || this.isAccessTokenExpired(token!)) {
            return false;
        }

        return true;
    }

    public static logout() {
        this.clearTokenData();
    }

    public static loginAsync(
        login: string,
        password: string,
        captchaToken: string | null | undefined,
    ) {
        return AuthApi.login({ login, password, captchaToken })
            .then((response) => {
                localStorage.setItem(this.accessTokenStorageName, response.accessToken);
                localStorage.setItem(this.refreshTokenStorageName, response.refreshToken);
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    }

    public static refreshTokenAsync = () => {
        const oldAccesstoken = this.getAccessToken();
        if (!AuthService.isAccessTokenHasValidSignature(oldAccesstoken)) {
            const error = new Error('Invalid sigrature of access token');
            return Promise.reject(error);
        }

        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            const error = new Error('Refresh token doesn`t exists');
            return Promise.reject(error);
        }

        const refreshTokenRequest: RefreshTokenRequest = {
            accessToken: oldAccesstoken || '',
            refreshToken,
        };

        return AuthApi.refreshToken(refreshTokenRequest)
            .then((response) => {
                localStorage.setItem(this.accessTokenStorageName, response.accessToken);
            })
            .catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    };

    private static isAccessTokenExpired(token: string): boolean {
        const decodedToken = this.getDecodedAccessToken(token);
        const expirationTime = ((decodedToken && decodedToken?.exp) || 0) * 1000;
        const actualTime = new Date().getTime();

        return expirationTime <= actualTime;
    }

    private static isAccessTokenHasValidSignature(token: string | null) {
        return !!token && !!this.getDecodedAccessToken(token);
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

    private static getRefreshToken() {
        return localStorage.getItem(this.refreshTokenStorageName);
    }

    private static clearTokenData() {
        localStorage.removeItem(this.accessTokenStorageName);
        localStorage.removeItem(this.refreshTokenStorageName);
    }
}
