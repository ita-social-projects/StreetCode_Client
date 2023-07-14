import IModelState from '@models/interfaces/IModelState';

export default interface Image {
    id: number;
    base64: string;
    blobName: string;
    mimeType: string;
    imageDetails?: ImageDetails;
}

export enum ImageAssigment {
    animation,
    blackandwhite,
    relatedfigure,
}

export interface ImageCreate {
    title?: string ;
    baseFormat: string;
    mimeType: string;
    extension: string;
}
export interface ImageDetails {
    id: number;
    title?: string;
    alt?: string;
    imageId: number;
}

export interface ImageCreateUpdate extends IModelState {
    id: number;
    streetcodeId?: number | null;
    imageDetails?: ImageDetails;
}
