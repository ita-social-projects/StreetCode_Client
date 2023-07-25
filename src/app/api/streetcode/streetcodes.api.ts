import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Streetcode,
{
    EventStreetcode, PersonStreetcode, StreetcodeCatalogRecord,
    StreetcodeCreate, StreetcodeMainPage, StreetcodeShort, StreetcodeUpdate,
} from '@models/streetcode/streetcode-types.model';

import StreetcodeFilterRequestDTO, { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';
import GetAllStreetcodes from '@/models/streetcode/getAllStreetcodes.request';

const StreetcodesApi = {
    getById: (id: number) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET}/${id}`),

    getByName: (name: string) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_NAME}/${name}`),

    getByTagId: (id: number) => Agent.get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_BY_TAG_ID}/${id}`),

    getByIndex: (index: string) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_INDEX}/${index}`),

    getByUrl: (url: string) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_URL}/${url}`),

    getAll: (getAllStreetcodes: GetAllStreetcodes | undefined) => Agent
        .get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_ALL}`, getAllStreetcodes),

    getAllPublished: () => Agent.get<StreetcodeShort[]>(`${API_ROUTES.STREETCODES.GET_ALL_PUBLISHED}`),

    getAllMainPage: () => Agent.get<StreetcodeMainPage[]>(`${API_ROUTES.STREETCODES.GET_ALL_MAINPAGE}`),

    getAllCatalog: (page: number, count: number) => Agent
        .get<StreetcodeCatalogRecord[]>(
            `${API_ROUTES.STREETCODES.GET_ALL_CATALOG}`,
            new URLSearchParams({ page: page.toString(), count: count.toString() }),
        ),

    getCount: () => Agent.get<number>(`${API_ROUTES.STREETCODES.GET_COUNT}`),

    getAllShort: () => Agent.get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_ALL_SHORT}`),

    getShortById: (id: number) => Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_SHORT_BY_ID}/${id}`),

    getByFilter: (filter: StreetcodeFilterRequestDTO) => Agent.get<StreetcodeFilterResultDTO[]>(
        `${API_ROUTES.STREETCODES.GET_BY_FILTER}`,
        new URLSearchParams(Object.entries(filter)),
    ),

    getEvents: () => Agent.get<EventStreetcode[]>(`${API_ROUTES.STREETCODES.GET_EVENTS}`),

    getPersons: () => Agent.get<PersonStreetcode[]>(`${API_ROUTES.STREETCODES.GET_PERSONS}`),

    getUrlByQrId: (id: number) => Agent.get<string>(`${API_ROUTES.STREETCODES.GET_URL_BY_QR_ID}/${id}`),

    create: (streetcode: StreetcodeCreate) => Agent
        .post<StreetcodeCreate>(`${API_ROUTES.STREETCODES.CREATE}`, streetcode),

    update: (streetcode: StreetcodeUpdate) => Agent
        .put<StreetcodeCreate>(`${API_ROUTES.STREETCODES.UPDATE}`, streetcode),

    updateState: (id: number, stateId: number) => Agent.put<void>(
        `${API_ROUTES.STREETCODES.UPDATE_STATE}/${id}/${stateId}`,
        {},
    ),

    delete: (id: number) => Agent.delete(`${API_ROUTES.STREETCODES.DELETE}/${id}`),

    existWithIndex: (index:number) => Agent.get<boolean>(`${API_ROUTES.STREETCODES.EXIST_WITH_INDEX}/${index}`),

    existWithUrl: (url: string) => Agent.get<boolean>(`${API_ROUTES.STREETCODES.EXIST_WITH_URL}/${url}`),
};

export default StreetcodesApi;
