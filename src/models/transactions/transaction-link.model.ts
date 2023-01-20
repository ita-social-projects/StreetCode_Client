import Url from '@models/additional-content/url.model';
import Streetcode from '@models/streetcode/streetcode-types.model';

export default interface TransactionLink {
    id: number;
    url: Url;
    qrCodeUrl: Url;
    streetcodeId: number;
    streetcode?: Streetcode | undefined;
}
