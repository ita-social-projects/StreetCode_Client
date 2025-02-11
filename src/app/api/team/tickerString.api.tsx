import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

const TickerStringAboutUs = {
    getString: () => (
        Agent.get<string>(`${API_ROUTES.ABOUT_US.GET_TICKER_STRING}`)
    ),
};

export default TickerStringAboutUs;
