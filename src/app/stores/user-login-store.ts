import UserApi from '@api/user/user.api';

import { RefreshTokenResponce, UserLoginResponce } from '@/models/user/user.model';

export default class UserLoginStore {
    private timeoutHandler?:NodeJS.Timeout;

    private tokenStorageName = 'token';

    public userLoginResponce?: UserLoginResponce;

    private callback?:()=>void;

    public setCallback(func:()=>void) {
        this.callback = func;
    }

    public setUserLoginResponce(user:UserLoginResponce, func:()=>void) {
        const expireForSeconds = (new Date(user.expireAt)).getTime() - new Date().getTime();
        this.setCallback(func);
        this.userLoginResponce = user;

        if (expireForSeconds > 10000) {
            this.timeoutHandler = setTimeout(() => {
                if (this.callback) {
                    this.callback();
                }
            }, expireForSeconds - 10000);
        }
    }

    public cleanToken = () => {
        sessionStorage.removeItem(this.tokenStorageName);
    };

    public refreshToken = ():Promise<RefreshTokenResponce> => (
        UserApi.refreshToken({ token: sessionStorage.getItem(this.tokenStorageName) ?? '' })
            .then((refreshToken) => {
                sessionStorage.setItem(this.tokenStorageName, refreshToken.token);
                const expireForSeconds = (new Date(refreshToken.expireAt)).getTime() - new Date().getTime();
                this.timeoutHandler = setTimeout(() => {
                    if (this.callback) {
                        this.callback();
                    }
                }, 10000);
                return refreshToken;
            }));
}
