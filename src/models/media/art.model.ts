import Streetcode from '@models/streetcode/streetcode-types.model';

import Image from './image.model';

export default interface Art {
    id: number;
    description?: string | undefined;
    streetcodes: Streetcode[];
    imageId: number;
    image: Image;
}
