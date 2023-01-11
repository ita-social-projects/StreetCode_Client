import Streetcode from '@models/streetcode/streetcode-types.model';

import Url from './url.model';

export enum SubtitleStatus {
    Editor = 'Editor',
    Illustrator = 'Illustrator',
}

export default interface Subtitle {
    id: number;
    subtitleStatus: number;
    firstName: string;
    lastName: string;
    description?: string | undefined;
    url: Url;
    streetcode: Streetcode;
}
