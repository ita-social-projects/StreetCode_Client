import { API_ROUTES } from "@/app/common/constants/api-routes.constants"
import Agent from "../agent.api"
import axios from "axios";

const JobApi = {
    getAllShort: () => Agent.get<JobShort[]>(API_ROUTES.JOB.GET_ALL_SHORT),
    deleteJob: (id: number) => Agent.delete<number>(`${API_ROUTES.JOB.DELETE}/${id}`),
    changeStatus: (id: number, status: boolean) => Agent.put<number>(`${API_ROUTES.JOB.CHANGE_STATUS}`,{id,status})
}

export default JobApi;