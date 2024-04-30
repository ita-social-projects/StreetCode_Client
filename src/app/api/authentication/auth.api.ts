/* eslint-disable no-underscore-dangle */
import axios from 'axios';

import { API_ROUTES } from '@/app/common/constants/api-routes.constants';
import {
    RefreshTokenRequest,
    RefreshTokenResponce,
    UserLoginRequest,
    UserLoginResponse,
} from '@/models/user/user.model';

const defaultBaseUrl = process.env.NODE_ENV === 'development'
    ? 'https://localhost:5001/api' : window._env_.API_URL;

const instance = axios.create({
    baseURL: defaultBaseUrl,
});

const AuthApi = {
    login: (loginParams: UserLoginRequest) => (
        instance.post<UserLoginResponse>(API_ROUTES.AUTH.LOGIN, loginParams)
            .then((response) => response.data)
    ),
    refreshToken: (tokenTokenPapams: RefreshTokenRequest) => (
        instance.post<RefreshTokenResponce>(API_ROUTES.AUTH.REFRESH_TOKEN, tokenTokenPapams)
            .then((response) => response.data)
    ),
};
export default AuthApi;
