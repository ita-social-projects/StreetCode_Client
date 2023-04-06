import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { HistoricalContext } from '@models/timeline/chronology.model';

const HistoricalContextApi = {
    getAll: () => Agent.get<HistoricalContext[]>(`${API_ROUTES.HISTORICAL_CONTEXT.GET_ALL}`),
};

export default HistoricalContextApi;
