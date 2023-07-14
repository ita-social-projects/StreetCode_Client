import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { Text } from '@models/streetcode/text-contents.model';

const TextsApi = {
    getAll: () => Agent.get<Text[]>(`${API_ROUTES.TEXTS.GET_ALL}`),

    getById: (id: number) => Agent.get<Text>(`${API_ROUTES.TEXTS.GET}/${id}`),

    getByStreetcodeId: (streetcodeId: number) => Agent.get<Text>(
        `${API_ROUTES.TEXTS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    create: (text: Text) => Agent.post<Text>(`${API_ROUTES.TEXTS.CREATE}`, text),

    update: (text: Text) => Agent.put<Text>(`${API_ROUTES.TEXTS.UPDATE}`, text),

    delete: (id: number) => Agent.delete(`${API_ROUTES.TEXTS.DELETE}/${id}`),

    getParsed: (text: string) => Agent.get<string>(
        `${API_ROUTES.TEXTS.GET_PARSED}`,
        new URLSearchParams({ text }),
    ),
};

export default TextsApi;
