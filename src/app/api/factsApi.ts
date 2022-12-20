import { agent } from "./agentApi";
import { Fact } from "../../models/fact/fact.model";
import { API_ROUTES } from "../common/contants/routes.constants";

export const FactsApi = {
    getById: (id: number) =>
        agent.get<Partial<Fact>>(`${API_ROUTES.FACTS.GET_BY_ID}/${id}`),

    getAll: () =>
       agent.get<Partial<Fact[]>>(`${API_ROUTES.FACTS.GET_ALL}`),

    getByStreetcodeId: (streetcodeId: number) =>
        agent.get<Partial<Fact>>(`${API_ROUTES.FACTS.GET_BY_STREETCODE_ID}/${streetcodeId}`),

    create: (fact: Fact) =>
        agent.post<Partial<Fact>>(`${API_ROUTES.FACTS.CREATE}`, fact),

    update: (fact: Fact) =>
        agent.put<Partial<Fact>>(`${API_ROUTES.FACTS.UPDATE}`, fact),

    delete: (id: number) =>
        agent.delete<Partial<Fact>>(`${API_ROUTES.FACTS.UPDATE}/${id}`),
}