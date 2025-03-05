import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Streetcode,
{
    EventStreetcode, PersonStreetcode, StreetcodeCatalogRecord,
    StreetcodeCreate, StreetcodeFavourite, StreetcodeMainPage, StreetcodeShort, StreetcodeUpdate,
} from '@models/streetcode/streetcode-types.model';

import StreetcodeFilterRequestDTO, { StreetcodeFilterResultDTO } from '@/models/filters/streetcode-filter.model';
import GetAllStreetcodes from '@/models/streetcode/getAllStreetcodes.request';

const StreetcodesApi = {
    getById: (id: number) => (
        Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET}/${id}`)
    ),

    getByUrl: (url: string) => (
        Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_BY_URL}/${url}`)
    ),

    getFavouriteStatus: (streetcodeId: number) => Agent
        .get<boolean>(`${API_ROUTES.STREETCODES.GET_FAVOURITE_STATUS}/${streetcodeId}`),

    getAll: (getAllStreetcodes: GetAllStreetcodes | undefined) => (
        Agent.get<{ totalAmount: number, streetcodes: Streetcode[] }>(
            `${API_ROUTES.STREETCODES.GET_ALL}`,
            getAllStreetcodes,
        )
    ),

    getAllPublished: () => (
        Agent.get<StreetcodeShort[]>(`${API_ROUTES.STREETCODES.GET_ALL_PUBLISHED}`)
    ),

    getPageMainPage: (page: number, pageSize: number) => Agent
        .get<StreetcodeMainPage[]>(
            `${API_ROUTES.STREETCODES.GET_PAGE_MAINPAGE}`,
            new URLSearchParams(Object.entries(
                {
                    page: page.toString(),
                    pageSize: pageSize.toString(),
                },
            )),
        ),

    getAllCatalog: (page: number, count: number) => Agent
        .get<StreetcodeCatalogRecord[]>(
            `${API_ROUTES.STREETCODES.GET_ALL_CATALOG}`,
            new URLSearchParams({ page: page.toString(), count: count.toString() }),
        ),

    getAllFavourites: () => Agent
        .get<StreetcodeFavourite[]>(
            `${API_ROUTES.STREETCODES.GET_ALL_FAVOURITES}`,
        ),

    getCount: (onlyPublished = false) => (
        Agent.get<number>(`${API_ROUTES.STREETCODES.GET_COUNT}?onlyPublished=${onlyPublished}`)
    ),

    getAllShort: () => (
        Agent.get<Streetcode[]>(`${API_ROUTES.STREETCODES.GET_ALL_SHORT}`)
    ),

    create: (streetcode: StreetcodeCreate) => Agent
        .post<StreetcodeCreate>(`${API_ROUTES.STREETCODES.CREATE}`, streetcode),

    createFavourite: (streetcodeId: number) => Agent
        .post<number>(`${API_ROUTES.STREETCODES.CREATE_FAVOURITE}/${streetcodeId}`, Object),

    update: (streetcode: StreetcodeUpdate) => Agent
        .put<StreetcodeUpdate>(`${API_ROUTES.STREETCODES.UPDATE}`, streetcode),

    updateState: (id: number, stateId: number) => Agent
        .put<void>(`${API_ROUTES.STREETCODES.UPDATE_STATE}/${id}/${stateId}`, {}),

    getShortById: (id: number) => (
        Agent.get<Streetcode>(`${API_ROUTES.STREETCODES.GET_SHORT_BY_ID}/${id}`)
    ),

    getByFilter: (filter: StreetcodeFilterRequestDTO) => (
        Agent.get<StreetcodeFilterResultDTO[]>(
            `${API_ROUTES.STREETCODES.GET_BY_FILTER}`,
            new URLSearchParams(Object.entries(filter)),
        )
    ),

    deleteFromFavourite: (id: number) => Agent.delete(`${API_ROUTES.STREETCODES.DELETE_FROM_FAVOURITES}/${id}`),

    existWithIndex: (index:number) => Agent.get<boolean>(`${API_ROUTES.STREETCODES.EXIST_WITH_INDEX}/${index}`),

    delete: (id: number) => (
        Agent.delete(`${API_ROUTES.STREETCODES.DELETE}/${id}`)
    ),

    existWithUrl: (url: string) => (
        Agent.get<boolean>(`${API_ROUTES.STREETCODES.EXIST_WITH_URL}/${url}`)
    ),
};

export default StreetcodesApi;
