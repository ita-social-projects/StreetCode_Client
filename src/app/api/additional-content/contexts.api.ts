import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Context, { ContextCreate } from '@models/additional-content/context.model';

const ContextsApi = {
    getById: (id: number) => Agent.get<Context>(`${API_ROUTES.CONTEXTS.GET_BY_ID}/${id}`),

    getAll: () => Agent.get<Context[]>(`${API_ROUTES.CONTEXTS.GET_ALL}`),

    create: (tag: ContextCreate) => Agent.post<Context>(`${API_ROUTES.CONTEXTS.CREATE}`, tag),

    update: (tag: Context) => Agent.put<Context>(`${API_ROUTES.CONTEXTS.UPDATE}`, tag),

    delete: (id: number) => Agent.delete(`${API_ROUTES.CONTEXTS.DELETE}/${id}`),
};

export default ContextsApi;
