import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import FRONTEND_ROUTES from '../common/constants/frontend-routes.constants';
import UserLoginStore from '../stores/user-login-store';

axios.defaults.baseURL = 'https://localhost:5001/api';

axios.interceptors.response.use(
    async (response) => response,
    ({ response, message }: AxiosError) => {
        if (message === 'Network Error' && process.env.NODE_ENV !== 'production') {
            toast.error(message);
        }
        let messageError = '';

        switch (response?.status) {
        case StatusCodes.INTERNAL_SERVER_ERROR:
            messageError = ReasonPhrases.INTERNAL_SERVER_ERROR;
            break;
        case StatusCodes.UNAUTHORIZED:
            messageError = (ReasonPhrases.UNAUTHORIZED);
            redirect(FRONTEND_ROUTES.ADMIN.LOGIN);
            break;
        case StatusCodes.NOT_FOUND:
            messageError = (ReasonPhrases.NOT_FOUND);
            break;
        case StatusCodes.BAD_REQUEST:
            messageError = ReasonPhrases.BAD_REQUEST;
            break;
        case StatusCodes.FORBIDDEN:
            messageError = ReasonPhrases.FORBIDDEN;
            break;
        default:
            break;
        }
        if (messageError !== '' && process.env.NODE_ENV !== 'production') {
            toast.error(messageError);
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
        axios.delete<T>(url).then(responseBody);
    },
};

export default Agent;
