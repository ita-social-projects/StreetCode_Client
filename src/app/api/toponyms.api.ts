import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import { Toponym } from "models/toponyms/toponym.model";

const ToponymsApi = {
    getAll: () =>
        Agent.get<Toponym>(`${API_ROUTES.TOPONYMS.GET_ALL}`),

    getById: (id: number) =>
        Agent.get<Toponym>(`${API_ROUTES.TOPONYMS.GET}/${id}`),

    getByName: (name: string) =>
       Agent.get<Toponym>(`${API_ROUTES.TOPONYMS.GET_BY_NAME}/${name}`),

    create: (toponym: Toponym) =>
        Agent.post<Toponym>(`${API_ROUTES.TOPONYMS.CREATE}`, toponym),

    update: (toponym: Toponym) =>
        Agent.put<Toponym>(`${API_ROUTES.TOPONYMS.UPDATE}`, toponym),

    delete: (id: number) =>
        Agent.delete(`${API_ROUTES.TOPONYMS.DELETE}/${id}`),
}

export default ToponymsApi;