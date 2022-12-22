import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import { Text } from "models/streetcode/text-contents.model";

const TextApi = {

    getAll: () =>
       Agent.get<Partial<Text[]>>(`${API_ROUTES.TEXTS.GET_BY_ID}`),

    create: (text: Text) =>
        Agent.post<Partial<Text>>(`${API_ROUTES.TEXTS.CREATE}`, text),

    update: (text: Text) =>
        Agent.put<Partial<Text>>(`${API_ROUTES.TEXTS.UPDATE}`, text),

    delete: (id: number) =>
        Agent.delete<Partial<Text>>(`${API_ROUTES.TEXTS.DELETE}/${id}`),
}

export default TextApi;