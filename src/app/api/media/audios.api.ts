import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Audio, { AudioCreate } from '@models/media/audio.model';

const AudiosApi = {
    getAll: () => Agent.get<Audio[]>(`${API_ROUTES.AUDIOS.GET_ALL}`),

    getById: (id: number) => Agent.get<Audio>(`${API_ROUTES.AUDIOS.GET}/${id}`),

    getByStreetcodeId: (streetcodeId: number) => Agent.get<Audio>(
        `${API_ROUTES.AUDIOS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    create: (audio: AudioCreate) => Agent.post<Audio>(`${API_ROUTES.AUDIOS.CREATE}`, audio),

    update: (audio: Audio) => Agent.post<Audio>(`${API_ROUTES.AUDIOS.UPDATE}`, audio),

    delete: (id: number) => Agent.delete(`${API_ROUTES.AUDIOS.DELETE}/${id}`),
};

export default AudiosApi;
