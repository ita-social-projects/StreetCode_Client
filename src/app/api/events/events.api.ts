import Agent from "@api/agent.api";
import { API_ROUTES } from "@constants/api-routes.constants";
import CalendarEvent from "@models/calendar/calendarEvent.model";

const EventsApi = {
  getById: (id: string) =>
    Agent.get<CalendarEvent>(`${API_ROUTES.EVENT.GET}/${id}`),

  getAll: (page?: number, pageSize?: number) => {
    const params = Object.entries({
      page: page?.toString() ?? "",
      pageSize: pageSize?.toString() ?? "",
    });

    const queryParams = params.filter((p) => !!p[1]);

    const searchParams = new URLSearchParams(queryParams);

    return Agent.get<{ totalAmount: number; events: CalendarEvent[] }>(
      `${API_ROUTES.EVENT.GET_ALL}`,
      searchParams
    );
  },

  create: (eventData: any) =>
    Agent.post<CalendarEvent>(`${API_ROUTES.EVENT.CREATE}`, eventData),

  update: (id: string, eventData: any) =>
    Agent.put<CalendarEvent>(`${API_ROUTES.EVENT.UPDATE}/${id}`, eventData),

  delete: (id: string) => Agent.delete(`${API_ROUTES.EVENT.DELETE}/${id}`),
};

export default EventsApi;
