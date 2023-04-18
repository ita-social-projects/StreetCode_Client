import Streetcode from '@models/streetcode/streetcode-types.model';

import Url from './url.model';

export default interface Subtitle {
    id: number;
    subtitleText: string;
    streetcodeId: number;
}

export interface SubtitleCreate {
    subtitleText: string;
}
