import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Tag, { TagCreate } from '@models/additional-content/tag.model';

const TagsApi = {
    getById: (id: number) => Agent.get<Tag>(`${API_ROUTES.TAGS.GET}/${id}`),

    getByTitle: (title: string) => Agent.get<Tag>(`${API_ROUTES.TAGS.GET_BY_TITLE}/${title}`),

    getAll: (page?: number, pageSize?: number) => {
        const params = Object.entries({
            page: page?.toString() ?? '',
            pageSize: pageSize?.toString() ?? '',
        });

        const queryParams = params.filter(p => !!p[1]);

        const searchParams = new URLSearchParams(queryParams);

        return Agent.get<{totalAmount: number, tags: Tag[]}>(`${API_ROUTES.TAGS.GET_ALL}`, searchParams);
    },

    getTagsByStreetcodeId: (streetcodeId: number) => Agent.get<Tag[]>(
        `${API_ROUTES.TAGS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),
    create: (tag: TagCreate) => Agent.post<Tag>(`${API_ROUTES.TAGS.CREATE}`, tag),

    update: (tag: Tag) => Agent.put<Tag>(`${API_ROUTES.TAGS.UPDATE}`, tag),

    delete: (id: number) => Agent.delete(`${API_ROUTES.TAGS.DELETE}/${id}`),
};

export default TagsApi;
