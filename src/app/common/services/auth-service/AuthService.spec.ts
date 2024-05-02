/* eslint-disable no-restricted-imports */
import createMockServer from '../../../../../__mocks__/server';

import AuthService from './AuthService';

const accessTokenStorageName = 'AccessToken';
const refreshTokenStorageName = 'RefreshToken';

jest.mock('jwt-decode', () => ({
    jwtDecode: (token: string) => JSON.parse(token),
}));

const getTestAccessToken = (isValidSignature = true, isExpired = false) => {
    if (!isValidSignature) {
        return 'invalid_access_token';
    }

    const currentDateInSeconds = Date.now() / 1000;
    const tokenExpireIn = isExpired ? 0 : 10; // Valid token will expire in 10 seconds from creatin date.
    const tokenDecoded = {
        unique_name: 'test',
        family_name: 'test',
        email: 'test@test.com',
        role: 'Test',
        nbf: currentDateInSeconds,
        exp: currentDateInSeconds + tokenExpireIn,
        iat: currentDateInSeconds,
        iss: 'https://localhost:5001/',
        aud: [
            'https://localhost:5001/',
        ],
    };

    return JSON.stringify(tokenDecoded);
};

afterEach(() => {
    localStorage.removeItem(accessTokenStorageName);
    localStorage.removeItem(refreshTokenStorageName);
});

describe('AuthService', () => {
    describe('logout()', () => {
        it('clears tokens in local storage when logout() is executed', () => {
            // Arrange.
            localStorage.setItem(accessTokenStorageName, 'test_access_token');
            localStorage.setItem(refreshTokenStorageName, 'test_refresh_token');

            // Act.
            AuthService.logout();

            // Assert.
            expect(localStorage.getItem(accessTokenStorageName)).toBeFalsy();
            expect(localStorage.getItem(refreshTokenStorageName)).toBeFalsy();
        });
    });

    describe('isLoggedIn()', () => {
        it('returns false access token has invalid signature', () => {
            // Arrange.
            const testAccessToken = getTestAccessToken(false);
            localStorage.setItem(accessTokenStorageName, testAccessToken);

            // Act.
            const isLoggedIn = AuthService.isLoggedIn();

            // Assert.
            expect(isLoggedIn).toBeFalsy();
        });

        it('returns false access token has valid signature but is expired', () => {
            // Arrange.
            const testAccessToken = getTestAccessToken(true, true);
            localStorage.setItem(accessTokenStorageName, testAccessToken);

            // Act.
            const isLoggedIn = AuthService.isLoggedIn();

            // Assert.
            expect(isLoggedIn).toBeFalsy();
        });

        it('returns true access token has valid signature but is not expired', () => {
            // Arrange.
            const testAccessToken = getTestAccessToken(true, false);
            localStorage.setItem(accessTokenStorageName, testAccessToken);

            // Act.
            const isLoggedIn = AuthService.isLoggedIn();

            // Assert.
            expect(isLoggedIn).toBeTruthy();
        });
    });

    describe('loginAsync()', () => {
        describe('successful login', () => {
            const testAccessToken = 'test_access_token';
            const testRefreshToken = 'test_refresh_token';
            const successfulLoginResolveFn = () => ({
                accessToken: testAccessToken,
                refreshToken: testRefreshToken,
            });
            createMockServer([
                {
                    type: 'success',
                    method: 'post',
                    path: 'auth/login',
                    resolveFn: successfulLoginResolveFn,
                },
            ]);

            it('sets access and refresh tokens to local storage is login is successful', async () => {
                // Arrange.

                // Act.
                await AuthService.loginAsync('', '', '');

                // Assert.
                expect(localStorage.getItem(accessTokenStorageName)).toEqual(testAccessToken);
                expect(localStorage.getItem(refreshTokenStorageName)).toEqual(testRefreshToken);
            });
        });

        describe('unsuccessful login', () => {
            const loginErrorMessage = 'Unsuccessful login';
            createMockServer([
                {
                    type: 'error',
                    method: 'post',
                    path: 'auth/login',
                    errorStatusCode: 404,
                    errorMessage: loginErrorMessage,
                },
            ]);

            it('returns error when login is unsuccessful', async () => {
                // Arrange.

                // Act.
                await AuthService.loginAsync('', '', '')
                    .catch((error) => {
                        const actualErrorMessage = error.response.data.errorMessage;

                        // Assert.
                        expect(actualErrorMessage).toEqual(loginErrorMessage);
                    });
            });
        });
    });

    describe('refreshTokenAsync()', () => {
        it('returns error if previuos access token has invalid signature', async () => {
            // Arrange.
            const expectedErrorMessage = 'Invalid sigrature of access token';

            // Act.
            await AuthService.refreshTokenAsync()
                .catch((error) => {
                    const actualErrorMessage = error.message;

                    // Assert.
                    expect(actualErrorMessage).toEqual(expectedErrorMessage);
                });
        });

        it('returns error if refresh token doesn`t exist', async () => {
            // Arrange.
            const expectedErrorMessage = 'Refresh token doesn`t exists';
            const testAccessToken = getTestAccessToken(true, false);
            localStorage.setItem(accessTokenStorageName, testAccessToken);

            // Act.
            await AuthService.refreshTokenAsync()
                .catch((error) => {
                    const actualErrorMessage = error.message;

                    // Assert.
                    expect(actualErrorMessage).toEqual(expectedErrorMessage);
                });
        });

        describe('unsuccessful refreshToken api call', () => {
            const refreshTokenErrorMessage = 'Unsuccessful refreshToken call';
            createMockServer([
                {
                    type: 'error',
                    method: 'post',
                    path: 'auth/refreshToken',
                    errorStatusCode: 500,
                    errorMessage: refreshTokenErrorMessage,
                },
            ]);

            it('returns error when refreshToken call is unsuccessful', async () => {
                // Arrange.
                const testPreviousAccessToken = getTestAccessToken(true, false);
                localStorage.setItem(accessTokenStorageName, testPreviousAccessToken);
                localStorage.setItem(refreshTokenStorageName, 'test_refresh_token');

                // Act.
                await AuthService.refreshTokenAsync()
                    .catch((error) => {
                        const actualErrorMessage = error.response.data.errorMessage;

                        // Assert.
                        expect(actualErrorMessage).toEqual(refreshTokenErrorMessage);
                    });
            });
        });

        describe('successful refreshToken api call', () => {
            const testAccessToken = 'test_access_token';
            const successfulRefreshTokenResolveFn = () => ({
                accessToken: testAccessToken,
            });
            createMockServer([
                {
                    type: 'success',
                    method: 'post',
                    path: 'auth/refreshToken',
                    resolveFn: successfulRefreshTokenResolveFn,
                },
            ]);

            it('sets access token to local storage when refreshToken call is unsuccessful', async () => {
                // Arrange.
                const testPreviousAccessToken = getTestAccessToken(true, false);
                localStorage.setItem(accessTokenStorageName, testPreviousAccessToken);
                localStorage.setItem(refreshTokenStorageName, 'test_refresh_token');

                // Act.
                await AuthService.refreshTokenAsync();

                // Assert.
                expect(localStorage.getItem(accessTokenStorageName)).toBe(testAccessToken);
            });
        });
    });
});
