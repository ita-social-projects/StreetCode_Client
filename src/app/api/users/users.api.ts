/* eslint-disable no-underscore-dangle */
import Agent from '@api/agent.api';
import ForgotPassword, { UpdateForgotPassword } from '@models/user/password/forgotPassword.model';

import { API_ROUTES } from '@/app/common/constants/api-routes.constants';
import User, { UpdateUser } from '@/models/user/user.model';

const UsersApi = {
    getByUserName: () => (
        Agent.get<User>(API_ROUTES.USERS.GET_BY_USERNAME)
    ),

    existWithUserName: (userName: string) => (
        Agent.get<string[]>(`${API_ROUTES.USERS.EXIST_WITH_USERNAME}/${userName}`)
    ),

    update: (user: UpdateUser) => (
        Agent.put<User>(API_ROUTES.USERS.UPDATE, user)
    ),

    delete: (email: string) => (
        Agent.delete(`${API_ROUTES.USERS.DELETE}/${email}`)
    ),

    forgotPassword: (forgotPassword: ForgotPassword) => (
        Agent.post(`${API_ROUTES.USERS.FORGOT_PASSWORD}`, forgotPassword)
    ),

    updateForgotPassword: (updateForgotPassword: UpdateForgotPassword) => (
        Agent.put(`${API_ROUTES.USERS.FORGOT_PASSWORD_UPDATE}`, updateForgotPassword)
    ),
};
export default UsersApi;
