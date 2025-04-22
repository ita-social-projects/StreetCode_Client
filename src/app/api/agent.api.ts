/* eslint-disable no-restricted-imports */
/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_ROUTES } from '@constants/api-routes.constants';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import GetAllToponymsRequest from '@/models/toponyms/getAllToponyms.request';

import AuthService from '../common/services/auth-service/AuthService';

const defaultBaseUrl = process.env.NODE_ENV === 'development'
    ? 'https://localhost:5001/api' : window._env_.API_URL;

const frontendServerBaseUrl = process.env.NODE_ENV === 'development'
    ? 'https://localhost:4000' : window._env_.SERVER_API_URL;

const responseData = <T> (response: AxiosResponse<T>) => response.data;

const paginationResponseData = <T> (response: AxiosResponse<T>) => ({
    data: response.data,
    paginationInfo: JSON.parse(response.headers['x-pagination']),
});

const createAxiosInstance = (baseUrl: string) => {
    const instance = axios.create({
        baseURL: baseUrl,
    });

    instance.interceptors.response.use(
        async (response) => response,
        async ({ response, message }: AxiosError) => {
            let errorMessage = '';
            if (message === 'Network Error') {
                errorMessage = message;
            }

            if (response?.status === StatusCodes.UNAUTHORIZED) {
                return AuthService.refreshTokenAsync()
                    .then(() => {
                        response.config.headers.Authorization = `Bearer ${AuthService.getAccessToken()}`;
                        return instance.request(response.config);
                    })
                    .catch((error) => {
                        redirect(FRONTEND_ROUTES.AUTH.LOGIN);
                        return Promise.reject(error);
                    });
            }

            switch (response?.status) {
            case StatusCodes.INTERNAL_SERVER_ERROR:
                errorMessage = ReasonPhrases.INTERNAL_SERVER_ERROR;
                break;
            case StatusCodes.NOT_FOUND:
                errorMessage = ReasonPhrases.NOT_FOUND;
                break;
            case StatusCodes.BAD_REQUEST:
                errorMessage = ReasonPhrases.BAD_REQUEST;
                break;
            case StatusCodes.FORBIDDEN:
                errorMessage = ReasonPhrases.FORBIDDEN;
                break;
            default:
                break;
            }
            if (errorMessage !== '' && process.env.NODE_ENV === 'development') {
                toast.error(errorMessage);
            }

            return Promise.reject(response);
        },
    );

    instance.interceptors.request.use(async (config) => {
        const methodsToApply = ['post', 'delete', 'update'];
        const method = (config.method ?? ' ').toLowerCase() ?? 'get';

        if (methodsToApply.includes(method) && config.url !== `${API_ROUTES.EMAIL.SEND}`) {
            let token = AuthService.getAccessToken();

            if (token && AuthService.isAccessTokenExpired(token)) {
                try {
                    await AuthService.refreshTokenAsync();
                    token = AuthService.getAccessToken();
                } catch (error) {
                    redirect(FRONTEND_ROUTES.AUTH.LOGIN);
                    return Promise.reject(error);
                }
            }

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    if (AuthService) {
        instance.defaults.headers.common.Authorization = `Bearer ${AuthService.getAccessToken()}`;
    } else {
        console.error('AuthService is not initialized');
    }

    return {
        get: async <T> (url: string, params?: URLSearchParams | GetAllToponymsRequest) => (
            instance.get<T>(url, { params }).then(responseData)
        ),

        getPaginated: async <T> (url: string, params?: URLSearchParams) => (
            instance.get<T>(url, { params }).then(paginationResponseData)
        ),

        post: async <T> (url: string, body: object, headers?: object) => (
            instance.post<T>(url, body, headers).then(responseData)
        ),

        put: async <T> (url: string, body: object) => (
            instance.put<T>(url, body).then(responseData)
        ),

        delete: async <T>(url: string) => (
            instance.delete<T>(url).then(responseData)
        ),
    };
};

const Agent = createAxiosInstance(defaultBaseUrl);
const AgentFrontend = createAxiosInstance(frontendServerBaseUrl);

export { AgentFrontend };
export default Agent;
