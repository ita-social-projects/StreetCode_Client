import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import Art from "models/media/art.model";
import Image from "models/media/image.model";
import Audio from "models/media/audio.model";
import Video from "models/media/video.model";

const MediaApi = {
    getVideoById:(id:number) =>
        Agent.get<Video>(`${API_ROUTES.MEDIA.GET_VIDEO_BY_ID}/${id}`),

    createVideo: (video: Video) =>
        Agent.post<Video>(`${API_ROUTES.MEDIA.CREATE_VIDEO}`, video),

    deleteVideo: (id: number) =>
        Agent.delete<Video>(`${API_ROUTES.MEDIA.DELETE_VIDEO}/${id}`),

    getAudioById:(id:number) =>
        Agent.get<Audio>(`${API_ROUTES.MEDIA.GET_AUDIO_BY_ID}/${id}`),

    createAudio: (audio: Audio) =>
        Agent.post<Audio>(`${API_ROUTES.MEDIA.CREATE_AUDIO}`, audio),

    deleteAudio: (id: number) =>
        Agent.delete<Audio>(`${API_ROUTES.MEDIA.DELETE_AUDIO}/${id}`),

}

export default MediaApi;