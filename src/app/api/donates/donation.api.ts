import Donation from '@/models/feedback/donation.model';
import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

const DonationApi = {
    create: (donation: Donation) => Agent.post<Donation>(`https://2a0d-91-196-178-227.ngrok-free.app/api/Payment/CreateInvoice`, donation)
};

export default DonationApi;
//${API_ROUTES.DONATION.CREATE}