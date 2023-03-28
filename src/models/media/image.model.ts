import Url from '@models/additional-content/url.model';

export default interface Image {
    id: number;
    alt?: string | undefined;
    blobName: string;
    base64: string;
    mimeType: string;
}
