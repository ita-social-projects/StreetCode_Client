import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import { Toponym } from "models/toponyms/toponym.model";


const ToponymApi = {
    getById: (id: number) =>
        Agent.get<Partial<Toponym>>(`${API_ROUTES.TOPONYMS.GET_BY_ID}/${id}`),

    getByName: (name: string) =>
       Agent.get<Partial<Toponym>>(`${API_ROUTES.TOPONYMS.GET_BY_NAME}/${name}`),

    create: (toponym: Toponym) =>
        Agent.post<Partial<Toponym>>(`${API_ROUTES.TOPONYMS.CREATE}`, toponym),

    update: (toponym: Toponym) =>
        Agent.put<Partial<Toponym>>(`${API_ROUTES.TOPONYMS.UPDATE}`, toponym),

    delete: (id: number) =>
        Agent.delete<Partial<Toponym>>(`${API_ROUTES.TOPONYMS.UPDATE}/${id}`),
}

export default ToponymApi;