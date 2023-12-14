import Url from '@models/additional-content/url.model';
import Streetcode from '@models/streetcode/streetcode-types.model';

export default interface Video {
    id: number;
    description?: string | undefined;
    url: string;
    streetcode?: Streetcode | undefined;
    streetcodeId: number;
}

export interface VideoCreate {
    url: string;
}
