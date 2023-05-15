import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import News from '@models/news/news.model';

const NewsApi = {
    getById: (id: number) => Agent.get<News>(`${API_ROUTES.NEWS.GET}/${id}`),

    getAll: () => Agent.get<News[]>(`${API_ROUTES.NEWS.GET_ALL}`),

    create: (news: News) => Agent.post<News>(`${API_ROUTES.NEWS.CREATE}`, news),

    delete: (id: number) => Agent.delete(`${API_ROUTES.NEWS.DELETE}/${id}`),

    update: (news: News) => Agent.put<News>(`${API_ROUTES.NEWS.UPDATE}`, news),
};

export default NewsApi;
