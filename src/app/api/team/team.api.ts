import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import TeamMember, { TeamCreateUpdate } from '@models/team/team.model';

const TeamApi = {
    getById: (id: number) => (
        Agent.get<TeamMember>(`${API_ROUTES.TEAM.GET}/${id}`)
    ),

    getAll: (page?: number, pageSize?: number, title?: string, isMain?: boolean) => {
        const params: Record<string, string> = {};

        if (page !== undefined) params.page = page.toString();
        if (pageSize !== undefined) params.pageSize = pageSize.toString();
        if (title !== undefined) params.title = title;

        if (isMain === true) {
            params.isMain = isMain.toString();
        }

        const queryParams = new URLSearchParams(Object.entries(params));

        return Agent.get<{ totalAmount: number, teamMembers: TeamMember[] }>(
            `${API_ROUTES.TEAM.GET_ALL}`,
            queryParams,
        );
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
