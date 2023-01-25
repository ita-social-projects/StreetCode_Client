import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import TimelineItem from '@models/timeline/chronology.model';

const TimelineApi = {
    getAll: () => Agent.get<TimelineItem[]>(`${API_ROUTES.TIMELINE.GET_ALL}`),

    getById: (id: number) => Agent.get<TimelineItem>(`${API_ROUTES.TIMELINE.GET}/${id}`),

    getByStreetcodeId: (streetcodeId: number) => Agent
        .get<TimelineItem[]>(`${API_ROUTES.TIMELINE.GET_BY_STREETCODE_ID}/${streetcodeId}`),

    create: (timeline: TimelineItem) => Agent.post<TimelineItem>(`${API_ROUTES.TIMELINE.CREATE}`, timeline),

    update: (timeline: TimelineItem) => Agent.put<TimelineItem>(`${API_ROUTES.TIMELINE.UPDATE}`, timeline),

    delete: (id: number) => Agent.delete(`${API_ROUTES.TIMELINE.DELETE}/${id}`),
};

export default TimelineApi;
