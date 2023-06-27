import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Partner, { PartnerShort } from '@models/partners/partners.model';

import PartnerResponse from '@/models/partners/partnersResponse.model';

// eslint-disable-next-line no-restricted-imports
import { PartnerCreateUpdate } from '../../../models/partners/partners.model';

const PartnersApi = {
    getById: (id: number) => Agent.get<Partner>(`${API_ROUTES.PARTNERS.GET}/${id}`),

    getAll: () => Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_ALL}`),

    getAllShort: () => Agent.get<PartnerShort[]>(`${API_ROUTES.PARTNERS.GET_ALL_SHORT}`),

    getByStreetcodeId(streetcodeId: number) {
        return Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_BY_STREETCODE_ID}/${streetcodeId}`);
    },

    getPartnersToUpdateByStreetcodeId(streetcodeId: number) {
        return Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_PARTNERS_TO_UPDATE_BY_STREETCODE_ID}/${streetcodeId}`);
    },

    create: (partner: PartnerCreateUpdate) => Agent.post<Partner>(`${API_ROUTES.PARTNERS.CREATE}`, partner),

    update: (partner: PartnerCreateUpdate) => Agent.put<Partner>(`${API_ROUTES.PARTNERS.UPDATE}`, partner),

    delete: (id: number) => Agent.delete(`${API_ROUTES.PARTNERS.DELETE}/${id}`),
};

export default PartnersApi;
