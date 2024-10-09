import axios from 'axios';

import { API_ROUTES } from '@/app/common/constants/api-routes.constants';

import Agent from '../agent.api';

const JobApi = {
    getAll: (page?: number, pageSize?: number) => {        
        const params = Object.entries({
            page: page?.toString() ?? '',
            pageSize: pageSize?.toString() ?? '',
        });

        const queryParams = params.filter(p => !!p[1]);

        const searchParams = new URLSearchParams(queryParams);
        return Agent.get<{totalAmount: number, jobs: Job[]}>(`${API_ROUTES.JOB.GET_ALL}`, searchParams);
    },
    getAllShort: () => Agent.get<JobShort[]>(API_ROUTES.JOB.GET_ALL_SHORT),
    getActive: () => Agent.get<Job[]>(API_ROUTES.JOB.GET_ACTIVE),
    deleteJob: (id: number) => Agent.delete<number>(`${API_ROUTES.JOB.DELETE}/${id}`),
    changeStatus: (id: number, status: boolean) => Agent.put<number>(`${API_ROUTES.JOB.CHANGE_STATUS}`, { id, status }),
    getById: (id: number) => Agent.get<Job>(`${API_ROUTES.JOB.GET_BY_ID}/${id}`),
    create: (job: Job) => Agent.post<Job>(`${API_ROUTES.JOB.CREATE}`, job),
    update: (job: Job) => Agent.put<Job>(`${API_ROUTES.JOB.UPDATE}`, job),
};

export default JobApi;
