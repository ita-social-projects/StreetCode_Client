import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import StreetcodeCoordinate from '@/models/additional-content/coordinate.model';

const StreetcodeCoordinateApi = {
    getAll: () => Agent.get<StreetcodeCoordinate[]>(`${API_ROUTES.STREETCODE_COORDINATES.GET_ALL}`),

    getById: (id: number) => Agent.get<StreetcodeCoordinate>(`${API_ROUTES.STREETCODE_COORDINATES.GET}/${id}`),

    getByStreetcodeId: (streetcodeId: number) => Agent.get<StreetcodeCoordinate[]>(
        `${API_ROUTES.STREETCODE_COORDINATES.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    create: (streetcodeCoordinate: StreetcodeCoordinate) => Agent.post<StreetcodeCoordinate>(
        `${API_ROUTES.STREETCODE_COORDINATES.CREATE}`,
        streetcodeCoordinate,
    ),

    update: (streetcodeCoordinate: StreetcodeCoordinate) => Agent.post<StreetcodeCoordinate>(
        `${API_ROUTES.STREETCODE_COORDINATES.UPDATE}`,
        streetcodeCoordinate,
    ),

    delete: (id: number) => Agent.delete(`${API_ROUTES.STREETCODE_COORDINATES.DELETE}/${id}`),
};

export default StreetcodeCoordinateApi;