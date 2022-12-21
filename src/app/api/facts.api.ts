import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import Fact from "models/streetcode/text-contents.model";

const FactsApi = {
    getById: (id: number) =>
        Agent.get<Partial<Fact>>(`${API_ROUTES.FACTS.GET_BY_ID}/${id}`),

    getAll: () =>
       Agent.get<Partial<Fact[]>>(`${API_ROUTES.FACTS.GET_ALL}`),

    getByStreetcodeId: (streetcodeId: number) =>
        Agent.get<Partial<Fact>>(`${API_ROUTES.FACTS.GET_BY_STREETCODE_ID}/${streetcodeId}`),

    create: (fact: Fact) =>
        Agent.post<Partial<Fact>>(`${API_ROUTES.FACTS.CREATE}`, fact),

    update: (fact: Fact) =>
        Agent.put<Partial<Fact>>(`${API_ROUTES.FACTS.UPDATE}`, fact),

    delete: (id: number) =>
        Agent.delete<Partial<Fact>>(`${API_ROUTES.FACTS.UPDATE}/${id}`),
}

export default FactsApi;