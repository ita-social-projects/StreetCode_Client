/* eslint-disable no-underscore-dangle */
import Agent from '@api/agent.api';

import { API_ROUTES } from '@/app/common/constants/api-routes.constants';
import User, { UpdateUser } from '@/models/user/user.model';

const UsersApi = {
    getByUserName: () => (
        Agent.get<User>(API_ROUTES.USERS.GET_BY_USERNAME)
    ),
    update: (user : UpdateUser) => (
        Agent.put<User>(API_ROUTES.USERS.UPDATE, user)
    ),
    delete: (email : string) => Agent.delete(`${API_ROUTES.USERS.DELETE}/${email}`),

};
export default UsersApi;
