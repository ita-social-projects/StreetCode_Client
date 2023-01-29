import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Toponym from '@models/toponyms/toponym.model';

const ToponymsApi = {
    getAll: () => Agent.get<Toponym[]>(`${API_ROUTES.TOPONYMS.GET_ALL}`),

    getById: (id: number) => Agent.get<Toponym>(`${API_ROUTES.TOPONYMS.GET}/${id}`),

    getByName: (name: string) => Agent.get<Toponym>(`${API_ROUTES.TOPONYMS.GET_BY_NAME}/${name}`),

    getByStreetcodeId: (streetcodeId: number) => Agent.get<Toponym[]>(
        `${API_ROUTES.TOPONYMS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    create: (toponym: Toponym) => Agent.post<Toponym>(`${API_ROUTES.TOPONYMS.CREATE}`, toponym),

    update: (toponym: Toponym) => Agent.put<Toponym>(`${API_ROUTES.TOPONYMS.UPDATE}`, toponym),

    delete: (id: number) => Agent.delete(`${API_ROUTES.TOPONYMS.DELETE}/${id}`),
};

export default ToponymsApi;
