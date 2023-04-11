import Url from '@models/additional-content/url.model';

export default interface Image {
    id: number;
    alt?: string | undefined;
    base64: string;
    blobName: string;
    mimeType: string;
}

export interface ImageCreate {
    blobName: string;
    mimeType: string;
}
