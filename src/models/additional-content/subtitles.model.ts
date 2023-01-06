import Streetcode from 'models/streetcode/streetcode-types.model';
import Url from './url.model';


export enum SubtitleStatus {
    Editor = 'editor',
    Illustrator = 'illustrator',
}

export default interface Subtitle {
    id: number;
    status: SubtitleStatus;
    firstName: string;
    lastName: string;
    description?: string | undefined;
    url: Url;
    streetcode: Streetcode;
}
