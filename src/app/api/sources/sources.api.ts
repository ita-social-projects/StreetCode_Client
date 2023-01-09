import Agent from "@api/agent.api";
import { API_ROUTES } from "@constants/api-routes.constants";
import { SourceLink } from '@models/sources/source-links.model';

const SourcesApi = {
    getAll: () =>
        Agent.get<SourceLink[]>(`${API_ROUTES.SOURCES.GET_ALL}`),

    getById: (id: number) =>
        Agent.get<SourceLink>(`${API_ROUTES.SOURCES.GET}/${id}`),

    getByStreetcodeId: (id: number) =>
        Agent.get<SourceLink>(`${API_ROUTES.SOURCES.GET_BY_STREETCODE_ID}/${id}`),

    create: (source: SourceLink) =>
        Agent.post<SourceLink>(`${API_ROUTES.SOURCES.CREATE}`, source),

    update: (source: SourceLink) =>
        Agent.put<SourceLink>(`${API_ROUTES.SOURCES.UPDATE}`, source),

    delete: (id: number) =>
        Agent.delete(`${API_ROUTES.SOURCES.DELETE}/${id}`),
}

export default SourcesApi;