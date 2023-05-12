import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Partner, { PartnerShort } from '@models/partners/partners.model';
import News from '@models/news/news.model';
// eslint-disable-next-line no-restricted-imports
import { PartnerCreateUpdate } from '../../../models/partners/partners.model';

import PartnerResponse from '@/models/partners/partnersResponse.model';

const NewsApi = {
    getById: (id: number) => Agent.get<News>(`${API_ROUTES.NEWS.GET}/${id}`),

    getAll: () => Agent.get<News[]>(`${API_ROUTES.NEWS.GET_ALL}`),

    create: (news: News) => Agent.post<News>(`${API_ROUTES.NEWS.CREATE}`, news),

    delete: (id: number) => Agent.delete(`${API_ROUTES.NEWS.DELETE}/${id}`),
};

export default NewsApi;
