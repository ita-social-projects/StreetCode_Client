import Image from './image.model';

export default interface Art {
    id: number;
    description?: string | undefined;
    title?: string;
    imageId: number;
    image: Image;
}

export interface ArtCreateUpdate extends Omit<Art, 'image'> {
    image: Image | null;
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
    description?: string;
    image: string;
    index: number;
    title?: string;
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
