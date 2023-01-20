import { toast } from 'react-toastify';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => config);
/*
const token = AuthLocalStorage.getToken();
if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
}
*/

axios.interceptors.response.use(
    async (response) => response,
    ({ response, message, status }: AxiosError) => {
        if (message === 'Network Error') {
            toast.error(message);
        }

        switch (response?.status) {
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
        default:
            break;
        }

        return Promise.reject(message);
    },
);

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const Agent = {
    get: async <T> (url: string, params?: URLSearchParams) => axios.get<T>(url, { params })
        .then(responseBody),

    post: async <T> (url: string, body: object, headers?: object) => axios.post<T>(url, body, headers)
        .then(responseBody),

    put: async <T> (url: string, body: object) => axios.put<T>(url, body)
        .then(responseBody),

    // patch: async <T> (url: string, body: {}) => axios.put<T>(url, body)
    // .then(responseBody),

    delete: async <T>(url: string) => axios.delete<T>(url)
        .then(responseBody),
};

export default Agent;
