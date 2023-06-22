import Url from '@models/additional-content/url.model';

export default interface TransactionLink {
    id: number;
    url: string;
    urlTitle: string;
    streetcodeId: number;
}
