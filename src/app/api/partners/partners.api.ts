import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Partner, { PartnerCreateUpdate, PartnerShort } from '@models/partners/partners.model';

const PartnersApi = {
    getById: (id: number) => (
        Agent.get<Partner>(`${API_ROUTES.PARTNERS.GET}/${id}`)
    ),

    getAll: (page?: number, pageSize?: number) => {
        const params = Object.entries({
            page: page?.toString() ?? '',
            pageSize: pageSize?.toString() ?? '',
        });

        const queryParams = params.filter((p) => !!p[1]);

        const searchParams = new URLSearchParams(queryParams);
        return Agent.get<{ totalAmount: number, partners: Partner[] }>(`${API_ROUTES.PARTNERS.GET_ALL}`, searchParams);
    },

    getAllByIsKeyPartner: (isKeyPartner : boolean) => (
        Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_ALL_BY_IS_KEY_PARTNERS}/${isKeyPartner}`)
    ),

    getAllShort: () => (
        Agent.get<PartnerShort[]>(`${API_ROUTES.PARTNERS.GET_ALL_SHORT}`)
    ),

    getByStreetcodeId(streetcodeId: number) {
        return Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_BY_STREETCODE_ID}/${streetcodeId}`);
    },

    getPartnersToUpdateByStreetcodeId(streetcodeId: number) {
        return Agent.get<Partner[]>(`${API_ROUTES.PARTNERS.GET_PARTNERS_TO_UPDATE_BY_STREETCODE_ID}/${streetcodeId}`);
    },

    create: (partner: PartnerCreateUpdate) => (
        Agent.post<Partner>(`${API_ROUTES.PARTNERS.CREATE}`, partner)
    ),

    update: (partner: PartnerCreateUpdate) => (
        Agent.put<Partner>(`${API_ROUTES.PARTNERS.UPDATE}`, partner)
    ),

    delete: (id: number) => (
        Agent.delete(`${API_ROUTES.PARTNERS.DELETE}/${id}`)
    ),
};

export default PartnersApi;
