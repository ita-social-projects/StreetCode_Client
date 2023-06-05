import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import GetAllToponymsRequest from '@models/toponyms/getAllToponyms.request';
import Toponym from '@models/toponyms/toponym.model';

import GetAllToponymsResponse from '@/models/toponyms/getAllToponyms.response';

const ToponymsApi = {
    getAll: (getAllToponyms: GetAllToponymsRequest) => Agent
        .get<GetAllToponymsResponse>(`${API_ROUTES.TOPONYMS.GET_ALL}`, getAllToponyms),

    getById: (id: number) => Agent.get<Toponym>(`${API_ROUTES.TOPONYMS.GET}/${id}`),

    getByStreetcodeId: (streetcodeId: number) => Agent.get<Toponym[]>(
        `${API_ROUTES.TOPONYMS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    create: (toponym: Toponym) => Agent.post<Toponym>(`${API_ROUTES.TOPONYMS.CREATE}`, toponym),

    update: (toponym: Toponym) => Agent.put<Toponym>(`${API_ROUTES.TOPONYMS.UPDATE}`, toponym),

    delete: (id: number) => Agent.delete(`${API_ROUTES.TOPONYMS.DELETE}/${id}`),
};

export default ToponymsApi;
