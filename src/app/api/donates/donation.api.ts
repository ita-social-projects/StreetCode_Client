import Donation from '@/models/feedback/donation.model';
import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

const DonationApi = {
    create: (donation: Donation) => Agent.post<Donation>(`${API_ROUTES.DONATION.CREATE}`, donation)
};

export default DonationApi;
