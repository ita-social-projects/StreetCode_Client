import Agent from "./agent.api";
import { API_ROUTES } from "app/common/contants/routes.constants";
import { TransactionLink } from "models/transactions/transaction-link.model";

const TransactionLinkApi = {
    getById: (id: number) =>
        Agent.get<Partial<TransactionLink>>(`${API_ROUTES.TRANSACTION_LINKS.GET_BY_ID}/${id}`),

    create: (transactionLink: TransactionLink) =>
        Agent.post<Partial<TransactionLink>>(`${API_ROUTES.TRANSACTION_LINKS.CREATE}`, transactionLink),

    update: (transactionLink: TransactionLink) =>
        Agent.put<Partial<TransactionLink>>(`${API_ROUTES.TRANSACTION_LINKS.UPDATE}`, transactionLink),

    delete: (id: number) =>
        Agent.delete<Partial<TransactionLink>>(`${API_ROUTES.FACTS.UPDATE}/${id}`),
}

export default TransactionLinkApi;