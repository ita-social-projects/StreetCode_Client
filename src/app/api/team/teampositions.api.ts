import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Position, { PositionCreate } from '@models/additional-content/teampositions.model';

const PositionsApi = {
    getById: (id: number) => (
        Agent.get<Position>(`${API_ROUTES.POSITION.GET_BY_ID}/${id}`)
    ),

    getByTitle: (title: string) => (
        Agent.get<Position>(`${API_ROUTES.POSITION.GET_BY_TITLE}/${title}`)
    ),

    getAll: (page?: number, pageSize?: number) => {
        const params = Object.entries({
            page: page?.toString() ?? '',
            pageSize: pageSize?.toString() ?? '',
        });

        const queryParams = params.filter((p) => !!p[1]);

        const searchParams = new URLSearchParams(queryParams);

        return Agent.get<{ totalAmount: number, positions: Position[] }>(`${API_ROUTES.POSITIONS.GET_ALL}`, searchParams);
    },

    create: (position: PositionCreate) => (
        Agent.post<Position>(`${API_ROUTES.POSITION.CREATE}`, position)
    ),

    update: (position: Position) => (
        Agent.put<Position>(`${API_ROUTES.POSITION.UPDATE}`, position)
    ),

    delete: (id: number) => (
        Agent.delete(`${API_ROUTES.POSITION.DELETE}/${id}`)
    ),

    getAllWithTeamMembers: () => (
        Agent.get<Position[]>(`${API_ROUTES.POSITION.GET_ALL_WITH_TEAM_MEMBERS}`)
    ),
};

export default PositionsApi;
