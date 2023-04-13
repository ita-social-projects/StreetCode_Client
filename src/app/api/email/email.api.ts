import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import Email from '@/models/email/email.model';

const EmailApi = {
    send: (email: Email) => Agent.post<Email>(`${API_ROUTES.EMAIL.SEND}`, email),
};

export default EmailApi;
