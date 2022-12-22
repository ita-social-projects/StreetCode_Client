import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import { Term } from "models/streetcode/text-contents.model";

const TermsApi = {
    getById: (id: number) =>
        Agent.get<Term>(`${API_ROUTES.TERMS.GET_BY_ID}/${id}`),

    getAll: () =>
        Agent.get<Term[]>(`${API_ROUTES.TERMS.GET_ALL}`),

    create: (term: Term) =>
        Agent.post<Term>(`${API_ROUTES.TERMS.CREATE}`, term),

    update: (term: Term) =>
        Agent.put<Term>(`${API_ROUTES.TERMS.UPDATE}`, term),

    delete: (id: number) =>
        Agent.delete(`${API_ROUTES.TERMS.UPDATE}/${id}`),
}

export default TermsApi;