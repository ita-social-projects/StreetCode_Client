import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Partner from '@models/partners/partners.model';

const PartnersApi = {
    getById: (id: number) => Agent.get<Partner>(`${API_ROUTES.PARTNERS.GET}/${id}`),

    getAll: () => Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_ALL}`),

    getSponsors: () => Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_SPONSORS}`),

    getByStreetcodeId(streetcodeId: number) {
        return Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_BY_STREETCODE_ID}/${streetcodeId}`);
    },

    create: (partner: Partner) => Agent.post<Partner>(`${API_ROUTES.PARTNERS.CREATE}`, partner),

    update: (partner: Partner) => Agent.put<Partner>(`${API_ROUTES.PARTNERS.UPDATE}`, partner),

    delete: (id: number) => Agent.delete(`${API_ROUTES.PARTNERS.DELETE}/${id}`),
};

export default PartnersApi;
