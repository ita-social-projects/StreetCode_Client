export default interface Image {
  id: number;
  base64: string;
  blobName: string;
  mimeType: string;
  imageDetails?: ImageDetails;
}

export interface ImageDetails {
  id: number;
  title?: string;
  alt?: string;
  imageId: number;
}
