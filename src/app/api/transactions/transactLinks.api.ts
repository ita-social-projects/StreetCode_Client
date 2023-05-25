import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import TransactionLink from '@models/transactions/transaction-link.model';

const TransactionLinksApi = {
    getAll: () => Agent.get<TransactionLink[]>(`${API_ROUTES.TRANSACTION_LINKS.GET_ALL}`),

    getById: (id: number) => Agent.get<TransactionLink>(`${API_ROUTES.TRANSACTION_LINKS.GET_BY_ID}/${id}`),

    getByStreetcodeId: (id: number) => Agent
        .get<TransactionLink>(`${API_ROUTES.TRANSACTION_LINKS.GET_BY_STREETCODE_ID}/${id}`),

};

export default TransactionLinksApi;
