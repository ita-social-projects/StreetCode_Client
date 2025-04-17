import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Partner, { PartnerCreateUpdate, PartnerShort } from '@models/partners/partners.model';

const PartnersApi = {
    getById: (id: number) => (
        Agent.get<Partner>(`${API_ROUTES.PARTNERS.GET}/${id}`)
    ),

    getAll: (page?: number, pageSize?: number, title?: string, IsKeyPartner?: boolean) => {
        const params: Record<string, string> = {};

        if (page !== undefined) params.page = page.toString();
        if (pageSize !== undefined) params.pageSize = pageSize.toString();
        if (title !== undefined) params.title = title;

        if (IsKeyPartner === true) {
            params.IsKeyPartner = IsKeyPartner.toString();
        }

        const queryParams = new URLSearchParams(Object.entries(params));

        return Agent.get<{ totalAmount: number, partners: Partner[] }>(
            `${API_ROUTES.PARTNERS.GET_ALL}`,
            queryParams,
        );
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
