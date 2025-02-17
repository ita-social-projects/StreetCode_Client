import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import TeamMember, { TeamCreateUpdate } from '@models/team/team.model';

const TeamApi = {
    getById: (id: number) => (
        Agent.get<TeamMember>(`${API_ROUTES.TEAM.GET}/${id}`)
    ),

    getAll: (page?: number, pageSize?: number) => {
        const params = Object.entries({
            page: page?.toString() ?? '',
            pageSize: pageSize?.toString() ?? '',
        });

        const queryParams = params.filter((p) => !!p[1]);

        const searchParams = new URLSearchParams(queryParams);

        return Agent.get<{ totalAmount: number, teamMembers: TeamMember[] }>(`${API_ROUTES.TEAM.GET_ALL}`, searchParams);
    },

    getAllMain: () => (
        Agent.get<TeamMember[]>(`${API_ROUTES.TEAM.GET_ALL_MAIN}`)
    ),

    getByRoleId: (id:number) => (
        Agent.get<TeamMember[]>(`${API_ROUTES.TEAM.GET_BY_ROLE_ID}/${id}`)
    ),

    create: (team: TeamCreateUpdate) => (
        Agent.post<TeamMember>(`${API_ROUTES.TEAM.CREATE}`, team)
    ),

    update: (team: TeamCreateUpdate) => (
        Agent.put<TeamMember>(`${API_ROUTES.TEAM.UPDATE}`, team)
    ),

    delete: (id: number) => (
        Agent.delete(`${API_ROUTES.TEAM.DELETE}/${id}`)
    ),
};

export default TeamApi;
