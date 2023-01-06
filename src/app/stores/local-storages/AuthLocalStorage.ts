export default class AuthLocalStorage {
    static STORAGE_KEY = "jwtToken";

    static getToken() {
        return window.localStorage.getItem(AuthLocalStorage.STORAGE_KEY);
    }

    static setToken(token: string) {
        window.localStorage.setItem(AuthLocalStorage.STORAGE_KEY, token);
    }

    static removeToken() {
        window.localStorage.removeItem(AuthLocalStorage.STORAGE_KEY);
    }
}