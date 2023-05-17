import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import TeamMember from '@models/team/team.model';
import { TeamCreateUpdate } from '@models/team/team.model';

const TeamApi = {
    getById: (id: number) => Agent.get<TeamMember>(`${API_ROUTES.TEAM.GET}/${id}`),

    getAll: () => Agent.get<TeamMember[]>(`${API_ROUTES.TEAM.GET_ALL}`),

    getAllMain: () => Agent.get<TeamMember[]>(`${API_ROUTES.TEAM.GET_ALL_MAIN}`),

    create: (team: TeamCreateUpdate) => Agent.post<TeamMember>(`${API_ROUTES.TEAM.CREATE}`, team),

    update: (team: TeamCreateUpdate) => Agent.put<TeamMember>(`${API_ROUTES.TEAM.UPDATE}`, team),

    delete: (id: number) => Agent.delete(`${API_ROUTES.TEAM.DELETE}/${id}`),
};

export default TeamApi;
