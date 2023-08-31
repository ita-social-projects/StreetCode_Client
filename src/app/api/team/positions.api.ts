import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { Positions } from '@models/team/team.model';

const PositionsApi = {

    getAll: () => Agent.get<Positions[]>(`${API_ROUTES.POSITIONS.GET_ALL}`),

    create: (position: Positions) => Agent.post<Positions>(`${API_ROUTES.POSITIONS.CREATE}`, position),

    getAllWithTeamMembers: () => Agent.get<Positions[]>(`${API_ROUTES.POSITIONS.GET_ALL_WITH_MEMBERS}`),

};

export default PositionsApi;
