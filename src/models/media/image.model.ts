import IModelState from '@models/interfaces/IModelState';
import IPersisted from '@models/interfaces/IPersisted';

export default interface Image {
    id: number;
    alt?: string | undefined;
    title?: string;
    base64: string;
    blobName: string;
    mimeType: string;
}

export interface ImageCreate {
    alt?: string ;
    title?: string ;
    baseFormat: string;
    mimeType: string;
    extension: string;
}

export interface ImageUpdate extends IModelState {
    id: number;
    streetcodeId?: number | null;
}
