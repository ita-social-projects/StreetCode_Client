import AuthService from './AuthService';

const accessTokenStorageName = 'AccessToken';
const refreshTokenStorageName = 'RefreshToken';

describe('AuthService', () => {
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
