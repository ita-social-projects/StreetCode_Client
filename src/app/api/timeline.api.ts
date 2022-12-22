import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import { Timeline } from "models/timeline/timeline-item.model";

const TimelineApi = {
    getById: (id: number) =>
        Agent.get<Partial<Timeline>>(`${API_ROUTES.TIMELINE.GET_BY_ID}/${id}`),

    create: (timeline: Timeline) =>
        Agent.post<Partial<Timeline>>(`${API_ROUTES.TIMELINE.CREATE}`, timeline),

    update: (timeline: Timeline) =>
        Agent.put<Partial<Timeline>>(`${API_ROUTES.TIMELINE.UPDATE}`, timeline),

    delete: (id: number) =>
        Agent.delete<Partial<Timeline>>(`${API_ROUTES.TIMELINE.UPDATE}/${id}`),
}

export default TimelineApi;