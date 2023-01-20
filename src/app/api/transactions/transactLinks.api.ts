import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import TransactionLink from '@models/transactions/transaction-link.model';

const TransactionLinksApi = {
    getAll: () => Agent.get<TransactionLink[]>(`${API_ROUTES.TRANSACTION_LINKS.GET_ALL}`),

    getById: (id: number) => Agent.get<TransactionLink>(`${API_ROUTES.TRANSACTION_LINKS.GET}/${id}`),

    create: (transactionLink: TransactionLink) => Agent.post<TransactionLink>(
        `${API_ROUTES.TRANSACTION_LINKS.CREATE}`,
        transactionLink,
    ),

    update: (transactionLink: TransactionLink) => Agent.put<TransactionLink>(
        `${API_ROUTES.TRANSACTION_LINKS.UPDATE}`,
        transactionLink,
    ),

    delete: (id: number) => Agent.delete(`${API_ROUTES.TRANSACTION_LINKS.DELETE}/${id}`),
};

export default TransactionLinksApi;
