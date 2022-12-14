export default class AuthLocalStorage {
  static STORAGE_KEY: string = "token";

  static getToken() {
    return window.localStorage.getItem(AuthLocalStorage.STORAGE_KEY);
  }

  static setToken(token: string) {
    window.localStorage.setItem(AuthLocalStorage.STORAGE_KEY, token);
  }

  static removeToken(): void {
    window.localStorage.removeItem(AuthLocalStorage.STORAGE_KEY);
  }
}