import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import Post from '@/models/instagram/instagram.model';

const InstagramApi = {
    getAll: () => Agent.get<Post[]>(`${API_ROUTES.INSTAGRAM.GET_ALL}`),
};

export default InstagramApi;
