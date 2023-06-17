import Image from './image.model';

export default interface Art {
    id: number;
    description?: string | undefined;
    title?: string | undefined;
    image: Image;
}

export interface ArtCreateUpdate extends Art {

}

export interface IndexedArt {
    index: number;
    description: string;
    imageHref: string;
    offset: number;
    title: string;
    sequenceNumber: number;
}
