import Streetcode from '@models/streetcode/streetcode-types.model';

import Image from './image.model';

export default interface Art {
    id: number;
    description?: string | undefined;
    streetcodes: Streetcode[];
    imageId: number;
    image: Image;
}

export interface IndexedArt {
    index: number;
    description: string;
    imageHref: string;
    offset: number;
    title: string;
    sequenceNumber: number;
}
export interface ArtCreate {
    imageId:number;
    description: string;
    image: string;
    index: number;
    title: string;
    mimeType:string;
    uidFile:string;
}

export interface ArtCreateDTO {
    imageId:number;
    description: string;
    index: number;
    title: string;
    mimeType:string;
}
