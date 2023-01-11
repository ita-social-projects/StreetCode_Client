import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Timeline from '@models/timeline/chronology.model';

const TimelineApi = {
    getAll: () => Agent.get<Timeline[]>(`${API_ROUTES.TIMELINE.GET_ALL}`),

    getById: (id: number) => Agent.get<Timeline>(`${API_ROUTES.TIMELINE.GET}/${id}`),

    create: (timeline: Timeline) => Agent.post<Timeline>(`${API_ROUTES.TIMELINE.CREATE}`, timeline),

    update: (timeline: Timeline) => Agent.put<Timeline>(`${API_ROUTES.TIMELINE.UPDATE}`, timeline),

    delete: (id: number) => Agent.delete(`${API_ROUTES.TIMELINE.DELETE}/${id}`),
};

export default TimelineApi;
