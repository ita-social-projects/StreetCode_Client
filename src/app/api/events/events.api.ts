import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { CalendarEvent, EventType } from '@models/calendar/calendarEvent.model';

const EventsApi = {
    getById: (id: string) => Agent.get<CalendarEvent>(`${API_ROUTES.EVENT.GET}/${id}`),

    getAll: (
        eventType?: EventType,
        page?: number,
        pageSize?: number,
        p0?: number,
    ) => {
        const params = Object.entries({
            eventType: eventType?.toString() ?? '',
            page: page?.toString() ?? '',
            pageSize: pageSize?.toString() ?? '',
        });

        const queryParams = params.filter((p) => !!p[1]);

        const searchParams = new URLSearchParams(queryParams);

        return Agent.get<{ totalAmount: number; events: CalendarEvent[] }>(
            `${API_ROUTES.EVENT.GET_ALL}`,
            searchParams,
        );
    },
    getAllShort: () => Agent.get<CalendarEvent[]>(`${API_ROUTES.EVENT.GET_ALL_SHORT}`),

    create: (eventData: any) => Agent.post<CalendarEvent>(`${API_ROUTES.EVENT.CREATE}`, eventData),

    update: (eventData: any) => Agent.put<CalendarEvent>(`${API_ROUTES.EVENT.UPDATE}`, eventData),

    delete: (id: string) => Agent.delete(`${API_ROUTES.EVENT.DELETE}/${id}`),
};

export default EventsApi;
