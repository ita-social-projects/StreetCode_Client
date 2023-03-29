import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Streetcode, { EventStreetcode, PersonStreetcode } from '@models/streetcode/streetcode-types.model';

import GetAllStreetcodesRequest from '@/models/streetcode/getAllStreetcodes.request';
import GetAllStreetcodesResponse from '@/models/streetcode/getAllStreetcodes.response';

const StreetcodesApi = {
    getById: (id: number) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET}/${id}`),

    getByName: (name: string) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_NAME}/${name}`),

    getByTagId: (id: number) => Agent.get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_BY_TAG_ID}/${id}`),

    getByIndex: (index: string) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_INDEX}/${index}`),

    getAll: (getAllStreetcodes: GetAllStreetcodesRequest) => Agent.get<GetAllStreetcodesResponse>(`${API_ROUTES.STREETCODES.GET_ALL}`, getAllStreetcodes),

    getByUrl: (url: string) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_URL}/${url}`),

    getEvents: () => Agent.get<EventStreetcode[]>(`${API_ROUTES.STREETCODES.GET_EVENTS}`),

    getPersons: () => Agent.get<PersonStreetcode[]>(`${API_ROUTES.STREETCODES.GET_PERSONS}`),

    create: (streetcode: Streetcode) => Agent.post<Streetcode>(`${API_ROUTES.STREETCODES.CREATE}`, streetcode),

    update: (streetcode: Streetcode) => Agent.put<Streetcode>(`${API_ROUTES.STREETCODES.UPDATE}`, streetcode),

    delete: (id: number) => Agent.delete(`${API_ROUTES.STREETCODES.DELETE}/${id}`),

    existWithIndex: (index:number) => Agent.get<boolean>(`${API_ROUTES.STREETCODES.EXIST_WITH_INDEX}/${index}`),
};

export default StreetcodesApi;
