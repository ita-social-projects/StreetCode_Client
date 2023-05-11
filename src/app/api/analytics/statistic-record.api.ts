import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import StatisticRecord from '@/models/analytics/statisticrecord.model';

const StatisticRecordApi = {
    getAll: () => Agent.get<StatisticRecord[]>(`${API_ROUTES.STATISTIC_RECORD.GET_ALL}`),

    getByQrId: (qrId: number) => Agent.get<StatisticRecord>(`${API_ROUTES.STATISTIC_RECORD.GET_BY_QRID}/${qrId}`),

    getAllByStreetcodeId: (streetcodeId: number) => Agent.get<StatisticRecord[]>(`${
        API_ROUTES.STATISTIC_RECORD.GET_ALL_BY_STREETCODE_ID}/${streetcodeId}`),

    existByQrId: (qrId: number) => Agent.get<boolean>(`${API_ROUTES.STATISTIC_RECORD.EXIST_BY_QRID}/${qrId}`),

    create: (statisticRecord: StatisticRecord) => Agent.post<StatisticRecord>(`${
        API_ROUTES.STATISTIC_RECORD.CREATE
    }`, statisticRecord),

    update: (qrId: number) => Agent.put(`${API_ROUTES.STATISTIC_RECORD.UPDATE}/${qrId}`, {}),

    delete: (id: number) => Agent.delete(`${API_ROUTES.STATISTIC_RECORD.DELETE}/${id}`),
};

export default StatisticRecordApi;
