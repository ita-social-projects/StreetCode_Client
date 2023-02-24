import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import RelatedFigure from '@models/streetcode/related-figure.model';

const RelatedFigureApi = {
    getAll: () => Agent.get<RelatedFigure[]>(`${API_ROUTES.RELATED_FIGURES.GET_ALL}`),

    getById: (id: number) => Agent.get<RelatedFigure>(`${API_ROUTES.RELATED_FIGURES.GET}/${id}`),

    getByStreetcodeId(streetcodeId: number) {
        return Agent.get<RelatedFigure[]>(`${API_ROUTES.RELATED_FIGURES.GET_BY_STREETCODE_ID}/${streetcodeId}`);
    },

    getByTagId(tagId: number) {
        return Agent.get<RelatedFigure[]>(`${API_ROUTES.RELATED_FIGURES.GET_BY_TAG_ID}/${tagId}`);
    },

    create(relatedFigure: RelatedFigure) {
        return Agent.post<RelatedFigure>(`${API_ROUTES.RELATED_FIGURES.CREATE}`, relatedFigure);
    },

    update(relatedFigure: RelatedFigure) {
        return Agent.put<RelatedFigure>(`${API_ROUTES.RELATED_FIGURES.UPDATE}`, relatedFigure);
    },

    delete: (id: number) => Agent.delete(`${API_ROUTES.RELATED_FIGURES.DELETE}/${id}`),
};

export default RelatedFigureApi;
