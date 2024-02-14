/* eslint-disable no-underscore-dangle */
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import UserLoginStore from '@stores/user-login-store';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const defaultBaseUrl = process.env.NODE_ENV === 'development'
    ? 'https://localhost:5001/api' : window._env_.API_URL;

const frontendServerBaseUrl = process.env.NODE_ENV === 'development'
    ? 'https://localhost:4000' : window._env_.SERVER_API_URL;

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const createAxiosInstance = (baseUrl: string) => {
    const instance = axios.create({
        baseURL: baseUrl,
    });

    instance.interceptors.response.use(
        async (response) => response,
        ({ response, message }: AxiosError) => {
            let errorMessage = '';
            if (message === 'Network Error') {
                errorMessage = message;
            }
            switch (response?.status) {
            case StatusCodes.INTERNAL_SERVER_ERROR:
                errorMessage = ReasonPhrases.INTERNAL_SERVER_ERROR;
                break;
            case StatusCodes.UNAUTHORIZED:
                errorMessage = ReasonPhrases.UNAUTHORIZED;
                redirect(FRONTEND_ROUTES.ADMIN.LOGIN);
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

            return Promise.reject(response?.status);
        },
    );

    instance.interceptors.request.use((config) => {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return config;
    });

    instance.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;

    return {
        get: async <T> (url: string, params?: URLSearchParams) => instance.get<T>(url, { params })
            .then(responseBody),

        post: async <T> (url: string, body: object, headers?: object) => instance.post<T>(url, body, headers)
            .then(responseBody),

        put: async <T> (url: string, body: object) => instance.put<T>(url, body)
            .then(responseBody),

        delete: async <T>(url: string) => instance.delete<T>(url)
            .then(responseBody),
    };
};

const Agent = createAxiosInstance(defaultBaseUrl);
const AgentFrontend = createAxiosInstance(frontendServerBaseUrl);

export { AgentFrontend };
export default Agent;
