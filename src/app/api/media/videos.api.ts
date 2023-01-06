import Agent from "../agent.api";
import { API_ROUTES } from "@app/common/contants/api-routes.constants";
import Video from "@models/media/video.model";

const VideosApi = {
    getAll: () =>
        Agent.get<Video>(`${API_ROUTES.VIDEOS.GET_ALL}`),

    getById: (id: number) =>
        Agent.get<Video>(`${API_ROUTES.VIDEOS.GET}/${id}`),

    create: (video: Video) =>
        Agent.post<Video>(`${API_ROUTES.VIDEOS.CREATE}`, video),

    update: (video: Video) =>
        Agent.post<Video>(`${API_ROUTES.VIDEOS.UPDATE}`, video),

    delete: (id: number) =>
        Agent.delete(`${API_ROUTES.VIDEOS.DELETE}/${id}`),
}

export default VideosApi;