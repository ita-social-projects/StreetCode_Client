import Url from '@models/additional-content/url.model';
import Streetcode from '@models/streetcode/streetcode-types.model';

export default interface Audio {
    id: number;
    description?: string | undefined;
    blobName: string;
    base64: string;
    mimeType: string;
    streetcode?: Streetcode | undefined;
    streetcodeId: number;
}

export interface AudioCreate {
    title?: string ;
    baseFormat: string;
    mimeType: string;
    extension: string;
}
