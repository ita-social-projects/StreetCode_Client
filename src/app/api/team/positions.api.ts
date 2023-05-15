import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { Positions } from '@models/team/team.model';

const PositionsApi = {
    getById: (id: number) => Agent.get<Positions>(`${API_ROUTES.POSITIONS.GET}/${id}`),

    getAll: () => Agent.get<Positions[]>(`${API_ROUTES.POSITIONS.GET_ALL}`),

    create: (position: Positions) => Agent.post<Positions>(`${API_ROUTES.POSITIONS.CREATE}`, position),

    update: (position: Positions) => Agent.put<Positions>(`${API_ROUTES.POSITIONS.UPDATE}`, position),

    delete: (id: number) => Agent.delete(`${API_ROUTES.POSITIONS.DELETE}/${id}`),
};

export default PositionsApi;
