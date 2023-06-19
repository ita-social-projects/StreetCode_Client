export default interface Image {
    id: number;
    base64: string;
    blobName: string;
    mimeType: string;
    imageDetails?: ImageDetails;
}

export interface ImageCreate {
    title?: string ;
    baseFormat: string;
    mimeType: string;
    extension: string;
}
export interface ImageDetails {
    id: number;
    title: string;
    alt: string;
}
