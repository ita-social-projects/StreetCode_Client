import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { Term } from '@models/streetcode/text-contents.model';

const TermsApi = {
    getById: (id: number) => (
        Agent.get<Term>(`${API_ROUTES.TERMS.GET}/${id}`)
    ),

    getAll: (page: number, pageSize: number, title = '') => {
        const params = Object.entries({
            page,
            pageSize,
            title,
        });

        const queryParams = params.filter(([_, value]) => value !== undefined && value !== '');
        const searchParams = new URLSearchParams(queryParams);

        return Agent.get<{ totalAmount: number; terms: Term[] }>(
            `${API_ROUTES.TERMS.GET_ALL}?${searchParams.toString()}`
        );
    },

    create: (term: Term) => (
        Agent.post<Term>(`${API_ROUTES.TERMS.CREATE}`, term)
    ),

    update: (term: Term) => (
        Agent.put<Term>(`${API_ROUTES.TERMS.UPDATE}`, term)
    ),

    delete: (id: number) => (
        Agent.delete(`${API_ROUTES.TERMS.DELETE}/${id}`)
    ),
};

export default TermsApi;
