import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Streetcode, { EventStreetcode, PersonStreetcode } from '@models/streetcode/streetcode-types.model';

const StreetcodesApi = {
    getById: (id: number) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET}/${id}`),

    getByName: (name: string) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_NAME}/${name}`),

    getByTagId: (id: number) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_TAG_ID}/${id}`),

    getByIndex: (index: string) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_INDEX}/${index}`),

    getAll: () => Agent.get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_ALL}`),

    getEvents: () => Agent.get<EventStreetcode[]>(`${API_ROUTES.STREETCODES.GET_EVENTS}`),

    getPersons: () => Agent.get<PersonStreetcode[]>(`${API_ROUTES.STREETCODES.GET_PERSONS}`),

    create: (streetcode: Streetcode) => Agent.post<Streetcode>(`${API_ROUTES.STREETCODES.CREATE}`, streetcode),

    update: (streetcode: Streetcode) => Agent.put<Streetcode>(`${API_ROUTES.STREETCODES.UPDATE}`, streetcode),

    delete: (id: number) => Agent.delete(`${API_ROUTES.STREETCODES.DELETE}/${id}`),
};

export default StreetcodesApi;
