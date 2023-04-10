import Agent from '@api/agent.api';

import { API_ROUTES } from '@/app/common/constants/api-routes.constants';
import { UserLoginRequest, UserLoginResponce } from '@/models/user/user.model';

const UserApi = {
    login: (loginParams:UserLoginRequest) => Agent.post<UserLoginResponce>(API_ROUTES.USERS.LOGIN, loginParams),
};
export default UserApi;
