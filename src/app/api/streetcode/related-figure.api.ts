import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import RelatedFigure from '@models/streetcode/related-figure.model';

const RelatedFigureApi = {
    getAll: () => Agent.get<RelatedFigure[]>(`${API_ROUTES.RELATED_FIGURES.GET_ALL}`),

    getById: (id: number) => Agent.get<RelatedFigure>(`${API_ROUTES.RELATED_FIGURES.GET}/${id}`),

    create: (relatedFigure: RelatedFigure) => Agent.post<RelatedFigure>(
        `${API_ROUTES.RELATED_FIGURES.CREATE}`,
        relatedFigure,
    ),

    update: (relatedFigure: RelatedFigure) => Agent.put<RelatedFigure>(
        `${API_ROUTES.RELATED_FIGURES.UPDATE}`,
        relatedFigure,
    ),

    delete: (id: number) => Agent.delete(`${API_ROUTES.RELATED_FIGURES.DELETE}/${id}`),
};

export default RelatedFigureApi;
