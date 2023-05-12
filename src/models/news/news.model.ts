import Url from '@models/additional-content/url.model';
import Image from '@models/media/image.model';

// eslint-disable-next-line no-restricted-imports
// import { StreetcodeShort } from '../streetcode/streetcode-types.model';

export default interface News {
    id: number;
    title: string;
    text: string;
    url: Url;
    imageId?: number;
    image?: Image;
    creationDate: Date;
}