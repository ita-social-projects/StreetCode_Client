import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import { RelatedTerm } from '@/models/streetcode/text-contents.model';

const RelatedTermApi = {
    getAllByTermId: (id: number) => Agent.get<RelatedTerm[]>(`${API_ROUTES.RELATED_TERMS.GET_ALL_BY_TERM_ID}/${id}`),

    create: (relatedTerm: RelatedTerm) => Agent.post<RelatedTerm>(`${API_ROUTES.RELATED_TERMS.CREATE}`, relatedTerm),

    update: (relatedTerm: RelatedTerm) => Agent.put<RelatedTerm>(`${API_ROUTES.RELATED_TERMS.UPDATE}`, relatedTerm),

    delete: (id: number) => Agent.delete(`${API_ROUTES.RELATED_TERMS.DELETE}/${id}`),
};

export default RelatedTermApi;
