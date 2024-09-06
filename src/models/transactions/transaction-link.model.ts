import IModelState from '@models/interfaces/IModelState';

export interface TransactionLink {
    id: number;
    url: string;
    urlTitle: string;
    streetcodeId: number;
}

export interface TransactionLinkUpdate extends IModelState {
    id: number;
    url: string;
    qrCodeUrl: string;
    urlTitle: string;
    streetcodeId: number;
}
