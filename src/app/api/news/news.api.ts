import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import News from '@models/news/news.model';
import { NewsWithUrl } from '@models/news/news.model';

const NewsApi = {
    getById: (id: number) => Agent.get<News>(`${API_ROUTES.NEWS.GET}/${id}`),

    getByUrl: (url: string) => Agent.get<News>(`${API_ROUTES.NEWS.GET_BY_URL}/${url}`),

    getNewsAndLinksByUrl: (url: string):Promise<NewsWithUrl> => Agent.get<NewsWithUrl>(`${API_ROUTES.NEWS.GET_NEWS_AND_LINKS_BY_URL}/${url}`),

    getAll: () => Agent.get<News[]>(`${API_ROUTES.NEWS.GET_ALL}`),

    getAllSortedNews: () => Agent.get<News[]>(`${API_ROUTES.NEWS.GET_ALL_SORTED}`),

    create: (news: News) => Agent.post<News>(`${API_ROUTES.NEWS.CREATE}`, news),

    delete: (id: number) => Agent.delete(`${API_ROUTES.NEWS.DELETE}/${id}`),

    update: (news: News) => Agent.put<News>(`${API_ROUTES.NEWS.UPDATE}`, news),
};

export default NewsApi;
