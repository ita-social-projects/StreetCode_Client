import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Position, {PositionCreate} from '@models/additional-content/teampositions.model';

const PositionsApi = {
    getById: (id: number) => Agent.get<Position>(`${API_ROUTES.POSITION.GET_BY_ID}/${id}`),

    getByTitle: (title: string) => Agent.get<Position>(`${API_ROUTES.POSITION.GET_BY_TITLE}/${title}`),

    getAll: () => Agent.get<Position[]>(`${API_ROUTES.POSITION.GET_ALL}`),

    create: (position: PositionCreate) => Agent.post<Position>(`${API_ROUTES.POSITION.CREATE}`, position),

    update: (position: Position) => Agent.put<Position>(`${API_ROUTES.POSITION.UPDATE}`, position),

    delete: (id: number) => Agent.delete(`${API_ROUTES.POSITION.DELETE}/${id}`),

    getAllWithTeamMembers: () => Agent.get<Position[]>(`${API_ROUTES.POSITION.GET_ALL_WITH_TEAM_MEMBERS}`),
};

export default PositionsApi;
