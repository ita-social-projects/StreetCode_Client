import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import { RelatedTerm } from '@/models/streetcode/text-contents.model';

const RelatedTermApi = {
    getAllByTermId: (id: number) => Agent.get<RelatedTerm[]>(`${API_ROUTES.RELATED_TERMS.GET_ALL_BY_TERM_ID}/${id}`),

    create: (relatedTerm: RelatedTerm) => Agent.post<RelatedTerm>(`${API_ROUTES.RELATED_TERMS.CREATE}`, relatedTerm),

    update: (id: number, relatedTerm: RelatedTerm) => Agent.put<RelatedTerm>(
        `${API_ROUTES.RELATED_TERMS.UPDATE}/${id}`,
        relatedTerm,
    ),

    delete: (word: string) => Agent.delete<RelatedTerm>(`${API_ROUTES.RELATED_TERMS.DELETE}/${word}`),
};

export default RelatedTermApi;
