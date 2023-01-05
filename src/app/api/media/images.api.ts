import { API_ROUTES } from 'app/common/contants/api-routes.constants';
import Image from 'models/media/audio.model';

import Agent from '../agent.api';

const ImagesApi = {
    getAll: () => Agent.get<Image>(`${API_ROUTES.IMAGES.GET_ALL}`),

    getById: (id: number) => Agent.get<Image>(`${API_ROUTES.IMAGES.GET}/${id}`),

    create: (image: Image) => Agent.post<Image>(`${API_ROUTES.IMAGES.CREATE}`, image),

    update: (image: Image) => Agent.post<Image>(`${API_ROUTES.IMAGES.UPDATE}`, image),

    delete: (id: number) => Agent.delete(`${API_ROUTES.IMAGES.DELETE}/${id}`),
};

export default ImagesApi;
