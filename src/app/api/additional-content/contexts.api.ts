import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Context, { ContextCreate } from '@models/additional-content/context.model';

const ContextsApi = {
    getById: (id: number) => (
        Agent.get<Context>(`${API_ROUTES.CONTEXTS.GET_BY_ID}/${id}`)
    ),

    getAll: (page?: number, pageSize?: number, title?: string) => {
        const params: Record<string, string> = {};

        if (page) params.page = page.toString();
        if (pageSize) params.pageSize = pageSize.toString();
        if (title) params.title = title;

        const searchParams = new URLSearchParams(params);

        const url = `${API_ROUTES.CONTEXTS.GET_ALL}?${searchParams.toString()}`;

        return Agent.get<{ totalAmount: number, historicalContexts: Context[] }>(url);
    },

    create: (tag: ContextCreate) => (
        Agent.post<Context>(`${API_ROUTES.CONTEXTS.CREATE}`, tag)
    ),

    update: (tag: Context) => (
        Agent.put<Context>(`${API_ROUTES.CONTEXTS.UPDATE}`, tag)
    ),

    delete: (id: number) => (
        Agent.delete(`${API_ROUTES.CONTEXTS.DELETE}/${id}`)
    ),
};

export default ContextsApi;
