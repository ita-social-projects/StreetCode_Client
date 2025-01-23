/* eslint-disable no-underscore-dangle */
import Agent from '@api/agent.api';
import ForgotPasswordDto, { UpdateForgotPasswordDTO } from '@models/user/password/forgotPassword.model';

import { API_ROUTES } from '@/app/common/constants/api-routes.constants';
import User, { UpdateUser } from '@/models/user/user.model';

const UsersApi = {
    getByUserName: () => (
        Agent.get<User>(API_ROUTES.USERS.GET_BY_USERNAME)
    ),
    existWithUserName: (userName: string) => (
        Agent.get<string[]>(`${API_ROUTES.USERS.EXIST_WITH_USERNAME}/${userName}`)
    ),
    update: (user : UpdateUser) => (
        Agent.put<User>(API_ROUTES.USERS.UPDATE, user)
    ),
    delete: (email : string) => Agent.delete(`${API_ROUTES.USERS.DELETE}/${email}`),
    forgotPassword: (forgotPassword: ForgotPasswordDto) => Agent.post(`${API_ROUTES.USERS.FORGOT_PASSWORD}`, forgotPassword),
    updateForgotPassword: (updateForgotPassword: UpdateForgotPasswordDTO) => Agent.put(`${API_ROUTES.USERS.FORGOT_PASSWORD_UPDATE}`, updateForgotPassword),
};
export default UsersApi;
