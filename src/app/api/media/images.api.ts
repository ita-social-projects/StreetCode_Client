import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Image, { ImageCreate } from '@models/media/image.model';

const ImagesApi = {
    getAll: () => Agent.get<Image[]>(`${API_ROUTES.IMAGES.GET_ALL}`),

    getById: (id: number) =>{/*  console.log(id);console.trace(); */  return Agent.get<Image>(`${API_ROUTES.IMAGES.GET}/${id}`);} ,

    getByStreetcodeId: (streetcodeId: number) => Agent
        .get<Image[]>(`${API_ROUTES.IMAGES.GET_BY_STREETCODE_ID}/${streetcodeId}`),

    create: (image: ImageCreate) => Agent.post<Image>(`${API_ROUTES.IMAGES.CREATE}`, image),

    update: (image: Image) => Agent.post<Image>(`${API_ROUTES.IMAGES.UPDATE}`, image),

    delete: (id: number) => Agent.delete(`${API_ROUTES.IMAGES.DELETE}/${id}`),
};

export default ImagesApi;
