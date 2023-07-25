import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import FRONTEND_ROUTES from '../common/constants/frontend-routes.constants';
import UserLoginStore from '../stores/user-login-store';

axios.defaults.baseURL = process.env.NODE_ENV === 'development'
    ? 'https://localhost:5001/api' : 'http://185.230.138.173:5000/api';

axios.interceptors.response.use(
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

        return Promise.reject(message);
    },
);

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const Agent = {
    get: async <T> (url: string, params?: URLSearchParams) => {
        axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return axios.get<T>(url, { params })
            .then(responseBody);
    },

    post: async <T> (url: string, body: object, headers?: object) => {
        axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return axios.post<T>(url, body, headers)
            .then(responseBody);
    },

    put: async <T> (url: string, body: object) => {
        axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return axios.put<T>(url, body)
            .then(responseBody);
    },

    delete: async <T>(url: string) => {
        axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return axios.delete<T>(url)
            .then(responseBody);
    },
};

export default Agent;
