import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { SourceCategory, SourceLink, SourceSubCategory } from '@models/sources/sources.model';

const SourcesApi = {
    getAllCategories: () => Agent.get<SourceCategory[]>(`${API_ROUTES.SOURCES.GET_ALL_CATEGORIES}`),

    getById: (id: number) => Agent.get<SourceCategory>(`${API_ROUTES.SOURCES.GET}/${id}`),

    getCategoriesByStreetcodeId: (streetcodeId: number) => Agent.get<SourceCategory[]>(
        `${API_ROUTES.SOURCES.GET_CATEGORIES_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    getSubCategoriesByCategoryId: async (categoryId?: number) => (
        (categoryId !== undefined)
            ? Agent.get<SourceSubCategory[]>(
                `${API_ROUTES.SOURCES.GET_SUBCATEGORIES_BY_CATEGORY_ID}/${categoryId}`,
            ) : undefined
    ),

    create: (source: SourceLink) => Agent.post<SourceLink>(`${API_ROUTES.SOURCES.CREATE}`, source),

    update: (source: SourceLink) => Agent.put<SourceLink>(`${API_ROUTES.SOURCES.UPDATE}`, source),

    delete: (id: number) => Agent.delete(`${API_ROUTES.SOURCES.DELETE}/${id}`),
};

export default SourcesApi;
