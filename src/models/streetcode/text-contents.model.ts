import Image from '@models/media/image.model';

import Streetcode from './streetcode-types.model';

export interface Fact {
    id: number;
    title: string;
    factContent: string;
    image: Image;
    imageId?: number | undefined;
    streetcodes: Streetcode[];
}

export interface Term {
    id: number;
    title: string;
    description?: string | undefined;
}

export interface Text {
    id: number;
    title: string;
    textContent: string;
    streetcodeId: number;
    streetcode?: Streetcode | undefined;
}
