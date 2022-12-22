import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import Streetcode from "models/streetcode/streetcode-types.model";
import Tag from "models/additional-content/tag.model";

const StreetcodesApi = {
    getById: (id: number) =>
        Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_ID}/${id}`),
        
    getByName: (name: string) =>
        Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_NAME}/${name}`),
    
    getByTagId: (id: number) =>
        Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_TAG_ID}/${id}`),
        
    getByIndex: (index: string) =>
        Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_INDEX}/${index}`),
    
    getAll: () =>
       Agent.get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_ALL}`),

    getEvents: () =>
       Agent.get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_EVENTS}`),
       
    getPersons: () =>
       Agent.get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_PERSONS}`),

    create: (streetcode: Streetcode) =>
        Agent.post<Streetcode>(`${API_ROUTES.STREETCODES.CREATE}`, streetcode),

    update: (streetcode: Streetcode) =>
        Agent.put<Partial<Streetcode>>(`${API_ROUTES.STREETCODES.UPDATE}`, streetcode),

    delete: (id: number) =>
        Agent.delete<Partial<Streetcode>>(`${API_ROUTES.STREETCODES.UPDATE}/${id}`),
}

export default StreetcodesApi;