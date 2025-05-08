/* eslint-disable class-methods-use-this */
import UsersApi from '@api/users/users.api';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import AuthApi from '@/app/api/authentication/auth.api';
import { RefreshTokenRequest, UserRegisterRequest, UserRole } from '@/models/user/user.model';

interface CustomJwtPayload extends JwtPayload {
    role: string;
}

export default class AuthService {
    private static accessTokenStorageName = 'AccessToken';

    private static refreshTokenStorageName = 'RefreshToken';

    public static getAccessToken(): string | null {
        return localStorage.getItem(AuthService.accessTokenStorageName);
    }

    public static isLoggedIn(): boolean {
        const token = this.getAccessToken();
        if (!token || !this.isAccessTokenHasValidSignature(token) || this.isAccessTokenExpired(token)) {
            return false;
        }

        return true;
    }

    public static async refreshOnTokenExpiry(): Promise<boolean> {
        try {
            await AuthService.refreshTokenAsync();
            return true;
        } catch (err) {
            return false;
        }
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
                localStorage.setItem(AuthService.accessTokenStorageName, response.accessToken);
                localStorage.setItem(AuthService.refreshTokenStorageName, response.refreshToken);
                return response;
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(error);
            });
    }

    public static async sendForgotPassword(email: string) {
        await UsersApi.forgotPassword({ email }).catch((error) => {
            console.error(error);
            return Promise.reject(error);
        });
    }

    public static async sendForgotPasswordUpdate(
        password: string,
        confirmPassword: string,
        username: string | null,
        token: string | null,
    ) {
        await UsersApi.updateForgotPassword({ password, confirmPassword, username, token }).catch((error) => {
            console.error(error);
            return Promise.reject(error);
        });
    }

    public static async registerAsync(
        request: UserRegisterRequest,
    ) {
        try {
            await AuthApi.register(request);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public static refreshTokenAsync = async () => {
        try {
            const oldAccesstoken = this.getAccessToken();
            if (!AuthService.isAccessTokenHasValidSignature(oldAccesstoken)) {
                const error = new Error('Invalid signature of access token');
                throw error;
            }

            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                const error = new Error('Refresh token doesn`t exists');
                throw error;
            }

            const refreshTokenRequest: RefreshTokenRequest = {
                accessToken: oldAccesstoken || '',
                refreshToken,
            };

            const response = await AuthApi.refreshToken(refreshTokenRequest);
            localStorage.setItem(AuthService.accessTokenStorageName, response.accessToken);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                return Promise.reject(error);
            }
        }
    };

    public static isAccessTokenExpired(token: string): boolean {
        const decodedToken = this.getDecodedAccessToken(token);
        const expirationTime = ((decodedToken && decodedToken?.exp) || 0) * 1000;
        const actualTime = new Date().getTime();

        return expirationTime <= actualTime;
    }

    private static isAccessTokenHasValidSignature(token: string | null) {
        return !!token && !!this.getDecodedAccessToken(token);
    }

    private static getDecodedAccessToken(token: string): CustomJwtPayload | null {
        let decodedToken: CustomJwtPayload | null = null;
        try {
            decodedToken = jwtDecode<CustomJwtPayload>(token);
        } catch (error) {
            return null;
        }

        return decodedToken;
    }

    private static getRefreshToken() {
        return localStorage.getItem(AuthService.refreshTokenStorageName);
    }

    private static clearTokenData() {
        localStorage.removeItem(AuthService.accessTokenStorageName);
        localStorage.removeItem(AuthService.refreshTokenStorageName);
    }

    public static isAdmin(): boolean {
        const token = this.getAccessToken();
        if (!token) {
            return false;
        }

        const decodedToken = this.getDecodedAccessToken(token);
        if (!decodedToken || !decodedToken.role) {
            return false;
        }

        return decodedToken.role === 'Admin';
    }

    public static getUserRole(): UserRole | null {
        const token = this.getAccessToken();
        if (!token) {
            return null;
        }

        const decodedToken = this.getDecodedAccessToken(token);
        if (!decodedToken || !decodedToken.role) {
            return null;
        }

        const role = decodedToken.role as keyof typeof UserRole;

        return UserRole[role];
    }

    static async googleLoginAsync(idToken: string | undefined): Promise<void> {
        try {
            const response = await AuthApi.loginGoogle({ idToken });
            const { accessToken, refreshToken } = response;

            localStorage.setItem(AuthService.accessTokenStorageName, accessToken);
            localStorage.setItem(AuthService.refreshTokenStorageName, refreshToken);

            console.log('Успішна авторизація через Google!');
        } catch (error) {
            console.error('Помилка авторизації через Google:', error);
            throw new Error('Не вдалося увійти через Google');
        }
    }
}
