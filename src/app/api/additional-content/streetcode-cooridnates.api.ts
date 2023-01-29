import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';
import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

const ArtsApi = {
    getAll: () => Agent.get<StreetcodeCoordinate[]>(`${API_ROUTES.STREETCODE_COORDINATES.GET_ALL}`),

    getById: (id: number) => Agent.get<StreetcodeCoordinate>(`${API_ROUTES.STREETCODE_COORDINATES.GET}/${id}`),

    getByStreetcodeId: (streetcodeId: number) => Agent.get<StreetcodeCoordinate[]>(
        `${API_ROUTES.STREETCODE_COORDINATES.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    create: (art: StreetcodeCoordinate) => Agent.post<StreetcodeCoordinate>(`${API_ROUTES.STREETCODE_COORDINATES.CREATE}`, art),

    update: (art: StreetcodeCoordinate) => Agent.post<StreetcodeCoordinate>(`${API_ROUTES.STREETCODE_COORDINATES.UPDATE}`, art),

    delete: (id: number) => Agent.delete(`${API_ROUTES.STREETCODE_COORDINATES.DELETE}/${id}`),
};

export default ArtsApi;