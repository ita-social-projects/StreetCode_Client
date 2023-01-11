import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Video from '@models/media/video.model';

const VideosApi = {
    getAll: () => Agent.get<Video[]>(`${API_ROUTES.VIDEOS.GET_ALL}`),

    getById: (id: number) => Agent.get<Video>(`${API_ROUTES.VIDEOS.GET}/${id}`),

    getByStreetcodeId: (streetcodeId: number) => Agent.get<Video>(
        `${API_ROUTES.VIDEOS.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    create: (video: Video) => Agent.post<Video>(`${API_ROUTES.VIDEOS.CREATE}`, video),

    update: (video: Video) => Agent.post<Video>(`${API_ROUTES.VIDEOS.UPDATE}`, video),

    delete: (id: number) => Agent.delete(`${API_ROUTES.VIDEOS.DELETE}/${id}`),
};

export default VideosApi;
