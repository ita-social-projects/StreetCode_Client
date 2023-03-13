import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { Fact } from '@models/streetcode/text-contents.model';

const FactsApi = {
    getById: (id: number) => Agent.get<Fact>(`${API_ROUTES.FACTS.GET}/${id}`),

    getAll: () => Agent.get<Fact[]>(`${API_ROUTES.FACTS.GET_ALL}`),

    getFactsByStreetcodeId: (streetcodeId: number) => Agent.get<Fact[]>(
        `${API_ROUTES.FACTS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    create: (fact: Fact) => Agent.post<Fact>(`${API_ROUTES.FACTS.CREATE}`, fact),

    update: (fact: Fact) => Agent.put<Fact>(`${API_ROUTES.FACTS.UPDATE}`, fact),

    delete: (id: number) => Agent.delete(`${API_ROUTES.FACTS.DELETE}/${id}`),
};

export default FactsApi;
