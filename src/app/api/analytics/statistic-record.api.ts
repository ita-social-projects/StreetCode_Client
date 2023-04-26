import StatisticRecord from '@/models/analytics/analytics/statisticrecord.model';
import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

const StatisticRecordApi = {
    getAll: () => Agent.get<StatisticRecord[]>(`${API_ROUTES.STATISTIC_RECORD.GET_ALL}`),
    
    getByQrId: (qrId: number) => Agent.get<StatisticRecord>(`${API_ROUTES.STATISTIC_RECORD.GET_BY_QRID}/${qrId}`),

    exisByQrId: (qrId:number) => Agent.get<boolean>(`${API_ROUTES.STATISTIC_RECORD.EXIST_BY_QRID}/${qrId}`),

    create: (statisticRecord: StatisticRecord) => Agent.post<StatisticRecord>(`${API_ROUTES.STATISTIC_RECORD.CREATE}`, statisticRecord),

    update: (statisticRecord: StatisticRecord) => Agent.put<StatisticRecord>(`${API_ROUTES.STATISTIC_RECORD.UPDATE}`, statisticRecord),

    delete: (id: number) => Agent.delete(`${API_ROUTES.STATISTIC_RECORD.DELETE}/${id}`),
};

export default StatisticRecordApi;
