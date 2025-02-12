import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { SourceCategory, SourceCategoryAdmin, SourceCategoryName, StreetcodeCategoryContent } from '@models/sources/sources.model';

const SourcesApi = {
    getAllCategories: (page?: number, pageSize?: number) => {
        const params = Object.entries({
            page: page?.toString() ?? '',
            pageSize: pageSize?.toString() ?? '',
        });

        const queryParams = params.filter((p) => !!p[1]);

        const searchParams = new URLSearchParams(queryParams);
        return Agent.get<{
            totalAmount: number,
            categories: SourceCategory[] }>(`${API_ROUTES.SOURCES.GET_ALL_CATEGORIES}`, searchParams);
    },

    getAllNames: () => (
        Agent.get<SourceCategoryName[]>(`${API_ROUTES.SOURCES.GET_ALL_CATEGORIES_NAMES}`)
    ),

    getById: (id: number) => (
        Agent.get<SourceCategory>(`${API_ROUTES.SOURCES.GET}/${id}`)
    ),

    getCategoriesByStreetcodeId: (streetcodeId: number) => (
        Agent.get<SourceCategory[]>(`${API_ROUTES.SOURCES.GET_CATEGORIES_BY_STREETCODE_ID}/${streetcodeId}`)
    ),

    getCategoryContentByStreetcodeId: (streetcodeId: number, categoryId: number) => (
        Agent.get<StreetcodeCategoryContent>(
            `${API_ROUTES.SOURCES.GET_CONTENT_BY_STREETCODE_ID}/${categoryId}&${streetcodeId}`,
        )
    ),

    create: (source: SourceCategoryAdmin) => (
        Agent.post<SourceCategoryAdmin>(`${API_ROUTES.SOURCES.CREATE}`, source)
    ),

    update: (source: SourceCategoryAdmin) => (
        Agent.put<SourceCategoryAdmin>(`${API_ROUTES.SOURCES.UPDATE}`, source)
    ),

    delete: (id: number) => (
        Agent.delete(`${API_ROUTES.SOURCES.DELETE}/${id}`)
    ),
};

export default SourcesApi;
