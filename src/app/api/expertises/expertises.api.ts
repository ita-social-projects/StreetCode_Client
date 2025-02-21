import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Expertise from '@models/user/expertises/expertise.model';

const ExpertisesApi = {
    getAll: () => (
        Agent.get<Expertise[]>(API_ROUTES.EXPERTISES.GET_ALL)
    ),
};

export default ExpertisesApi;
