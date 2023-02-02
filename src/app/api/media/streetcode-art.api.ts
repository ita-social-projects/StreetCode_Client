import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import StreetcodeArt from '@/models/media/streetcode-art.model';

const StreetcodeArtApi = {
    getAll: () => Agent.get<StreetcodeArt[]>(`${API_ROUTES.STREETCODE_ARTS.GET_ALL}`),

    getStreetcodeArtsByStreetcodeId: (streetcodeId: number) => Agent.get<StreetcodeArt[]>(
        `${API_ROUTES.STREETCODE_ARTS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),
};

export default StreetcodeArtApi;
