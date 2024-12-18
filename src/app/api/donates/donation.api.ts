import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import Donation, { DonationResponse } from '@/models/feedback/donation.model';

const DonationApi = {
    create: (donation: Donation)
        : Promise<DonationResponse> => Agent.post<DonationResponse>(`${API_ROUTES.DONATION.CREATE}`, donation),
};

export default DonationApi;
