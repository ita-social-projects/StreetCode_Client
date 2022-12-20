import axios, {AxiosError, AxiosResponse, Canceler} from "axios";
import {StatusCodes, ReasonPhrases} from "http-status-codes";
import {toast} from "react-toastify";
import AuthLocalStorage from "../stores/local-storages/AuthLocalStorage";

//const CancelToken = axios.CancelToken;
//const source = CancelToken.source();
//let cancel: Canceler;

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = AuthLocalStorage.getToken();
    if (token) {
        config.headers!.Authorization = `Bearer ${token}`;
    }

    return config;
});

axios.interceptors.response.use(
    res => res,
    (error: AxiosError) => {
        const { status: statusCode, config: { data } } = error.response!;

        switch (statusCode) {
            case StatusCodes.INTERNAL_SERVER_ERROR:
                toast.error(ReasonPhrases.INTERNAL_SERVER_ERROR);
                break;
            case StatusCodes.UNAUTHORIZED:
                toast.error(ReasonPhrases.UNAUTHORIZED);
                break;
            case StatusCodes.NOT_FOUND:
                toast.error(ReasonPhrases.NOT_FOUND);
                break;
            case StatusCodes.BAD_REQUEST:
                toast.error(ReasonPhrases.BAD_REQUEST);
                break;
            case StatusCodes.FORBIDDEN:
                toast.error(ReasonPhrases.FORBIDDEN);
                break;
        }
    }
);

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

export const agent = {
    get: async <T> (url: string, params?: URLSearchParams) => axios.get<T>(url, {params}).then(responseBody),
    post: async <T> (url: string, body: {}, headers?: {}) => axios.post<T>(url, body, headers).then(responseBody),
    put: async <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    //patch: async <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: async  <T>(url: string) => axios.delete<T>(url).then(responseBody),
}
