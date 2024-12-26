/* eslint-disable no-underscore-dangle */
import axios from 'axios';

import { API_ROUTES } from '@/app/common/constants/api-routes.constants';
import {
    RefreshTokenRequest,
    RefreshTokenResponce,
    UserLoginRequest,
    UserLoginResponse,
    UserRegisterRequest,
    UserRegisterResponse,
} from '@/models/user/user.model';

const defaultBaseUrl = process.env.NODE_ENV === 'development'
    ? 'https://localhost:5001/api' : window._env_.API_URL;

const instance = axios.create({
    baseURL: defaultBaseUrl,
});

const AuthApi = {
    register: (registerParams: UserRegisterRequest) => (
        instance.post<UserRegisterResponse>(API_ROUTES.AUTH.REGISTER, registerParams)
            .then((response) => response.data)
    ),
    login: (loginParams: UserLoginRequest) => (
        instance.post<UserLoginResponse>(API_ROUTES.AUTH.LOGIN, loginParams)
            .then((response) => response.data)
    ),
    loginGoogle: (idToken: string | undefined) => (
        instance.post<UserLoginResponse>(
            API_ROUTES.AUTH.LOGIN_GOOGLE,
            JSON.stringify(idToken),
            { headers: { 'Content-Type': 'application/json' } },
        ).then((response) => response.data)
    ),
    refreshToken: (tokenTokenPapams: RefreshTokenRequest) => (
        instance.post<RefreshTokenResponce>(API_ROUTES.AUTH.REFRESH_TOKEN, tokenTokenPapams)
            .then((response) => response.data)
    ),
};
export default AuthApi;
