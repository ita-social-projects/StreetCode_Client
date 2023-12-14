import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import {
    SourceCategory, SourceCategoryAdmin, SourceCategoryName, SourceLink, StreetcodeCategoryContent,
} from '@models/sources/sources.model';

const SourcesApi = {
    getAllCategories: () => Agent.get<SourceCategory[]>(`${API_ROUTES.SOURCES.GET_ALL_CATEGORIES}`),

    getAllNames: () => Agent.get<SourceCategoryName[]>(`${API_ROUTES.SOURCES.GET_ALL_CATEGORIES_NAMES}`),

    getById: (id: number) => Agent.get<SourceCategory>(`${API_ROUTES.SOURCES.GET}/${id}`),

    getCategoriesByStreetcodeId: (streetcodeId: number) => Agent.get<SourceCategory[]>(
        `${API_ROUTES.SOURCES.GET_CATEGORIES_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    getCategoryContentByStreetcodeId: (streetcodeId: number, categoryId: number) => Agent
        .get<StreetcodeCategoryContent>(
            `${API_ROUTES.SOURCES.GET_CONTENT_BY_STREETCODE_ID}/${categoryId}&${streetcodeId}`,
        ),

    create: (source: SourceCategoryAdmin) => Agent.post<SourceCategoryAdmin>(`${API_ROUTES.SOURCES.CREATE}`, source),

    update: (source: SourceCategoryAdmin) => Agent.put<SourceCategoryAdmin>(`${API_ROUTES.SOURCES.UPDATE}/${source.id}`, source),

    delete: (id: number) => Agent.delete(`${API_ROUTES.SOURCES.DELETE}/${id}`),
};

export default SourcesApi;
