import Url from '@models/additional-content/url.model';
import Streetcode from '@models/streetcode/streetcode-types.model';

export default interface Audio {
    id: number;
    description?: string | undefined;
    url: Url;
    streetcode?: Streetcode | undefined;
    streetcodeId: number;
}
